<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Chat') }}
        </h2>
    </x-slot>

    <div class="py-12 px-8">
        <!-- CometChat widget container -->
        <div id="cometchat-widget-container" style="height: 600px;"></div>
    </div>

    <!-- Load CometChat Widget Script -->
    <script src="https://widget-js.cometchat.io/v3/cometchatwidget.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const appID = "{{ env('VITE_COMETCHAT_APP_ID') }}";
            const region = "{{ env('VITE_COMETCHAT_REGION') }}";
            const authKey = "{{ env('VITE_COMETCHAT_AUTH_KEY') }}";
            const widgetID = "{{ env('VITE_COMETCHAT_WIDGET_ID') }}";
            const userId = "{{ auth()->user()->id }}";
            const userName = "{{ auth()->user()->name }}";

            CometChatWidget.init({
                appID: appID,
                appRegion: region,
                authKey: authKey
            }).then(() => {
                CometChatWidget.login({
                    uid: userId,
                    name: userName
                }).then(() => {
                    CometChatWidget.launch({
                        widgetID: widgetID,
                        target: "#cometchat-widget-container",
                        roundedCorners: true,
                        height: "600px",
                        width: "100%",
                        docked: false
                    });
                }).catch(error => {
                    console.error("Login failed:", error);
                });
            }).catch(error => {
                console.error("Init failed:", error);
            });
        });
    </script>
</x-app-layout>
