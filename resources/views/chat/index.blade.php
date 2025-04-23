<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Chat') }}
        </h2>
    </x-slot>

    {{-- Pass Laravel user to JS --}}
    <script>
        window.Laravel = {!! json_encode([
            'user' => [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
            ]
        ]) !!};
    </script>

    <div class="py-12 px-8">
        <div class="grid grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded shadow">
                <h3 class="font-bold mb-4">Users</h3>
                <ul id="user-list">
                    @foreach($users as $user)
                        <li class="cursor-pointer hover:bg-gray-100 p-2" onclick="startChat('{{ $user->id }}', '{{ $user->name }}')">
                            {{ $user->name }}
                        </li>
                    @endforeach
                </ul>
            </div>
            <div class="col-span-2 bg-white p-4 rounded shadow">
                <h3 class="font-bold mb-4" id="chat-with">Chat</h3>
                <div id="chat-box" class="h-64 overflow-y-auto border p-2 mb-4"></div>
                <input id="chat-input" class="w-full border rounded p-2" placeholder="Type a message...">
            </div>
        </div>
    </div>
</x-app-layout>
