<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
    
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
    
            event(new Registered($user));
    
            $cometChatApiUrl = "https://api-" . env('COMETCHAT_REGION') . ".cometchat.io/v3/users";
            $payload = [
                'uid' => $user->id,
                'name' => $user->name,
            ];
    
            $response = Http::withOptions(['verify' => false])
                ->withHeaders([
                    'appId' => env('COMETCHAT_APP_ID'),
                    'apiKey' => env('COMETCHAT_API_KEY'),
                    'Content-Type' => 'application/json',
                ])
                ->post($cometChatApiUrl, $payload);
    
            if ($response->successful()) {
                Log::info('CometChat user created successfully.', [
                    'user_id' => $user->id,
                    'cometchat_response' => $response->json(),
                ]);
            } else {
                Log::error('❌ Failed to create CometChat user.', [
                    'user_id' => $user->id,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);
            }
    
            Auth::login($user);
    
            return redirect()->route('dashboard');
        } catch (\Throwable $e) {
            Log::critical('Registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
    
            return redirect()->back()
                ->withErrors(['registration_error' => 'An unexpected error occurred. Please try again.'])
                ->withInput();
        }
    }
}
