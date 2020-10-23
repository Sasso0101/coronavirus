var OneSignal = OneSignal || [];
var buttonSelector = ".boxNotifica";

/* Initializes notifications */
OneSignal.push(function() {
    OneSignal.init({
        appId: "6df81c29-6877-4bda-81fa-602cba9abf83",
        notifyButton: {
            enable: false,
        },
        welcomeNotification: {
            message: "Grazie per l'iscrizione!"
        }
    });

    // Unsupported browser
    if (!OneSignal.isPushNotificationsSupported()) {
        document.querySelector(buttonSelector).style.display = "none";
        return;
    }
    OneSignal.on('notificationPermissionChange', function(permissionChange) {
        var currentPermission = permissionChange.to;
        if (currentPermission == "denied") {
            document.querySelector(buttonSelector).style.display = "none";
        }
        else {
            document.querySelector(buttonSelector).style.display = "";
        }
    });
    subscriptionButtonHandler(buttonSelector);
    OneSignal.on("subscriptionChange", function(isSubscribed) {
        subscriptionButtonHandler(buttonSelector);
    });
});

function subscriptionButtonClicked(event) {
    getSubscriptionState().then(function(state) {
        if (state.isPushEnabled) {
            /* Subscribed, opt them out */
            OneSignal.setSubscription(false);
        } else {
            if (state.isOptedOut) {
                /* Opted out, opt them back in */
                OneSignal.setSubscription(true);
            } else {
                /* Unsubscribed, subscribe them */
                OneSignal.registerForPushNotifications();
            }
        }
    });
    event.preventDefault();
}

function subscriptionButtonHandler(buttonSelector) {
    var hideWhenSubscribed = false;
    var subscribeText = "🔔 Clicca <span>qui</span> per ricevere una notifica i dati vengono aggiornati!";
    var unsubscribeText = "Annulla iscrizione alle notifiche live";

    var element = document.querySelector(buttonSelector);
    if (element === null) {
        return;
    }

    getSubscriptionState().then(function(state) {
        if (!state.isPushEnabled || state.isOptedOut) {
            var buttonText = subscribeText;
            element.classList.remove('disiscriviti');
        }
        else {
            var buttonText = unsubscribeText;
            element.classList.add('disiscriviti');
        }

        element.removeEventListener('click', subscriptionButtonClicked);
        element.addEventListener('click', subscriptionButtonClicked);
        element.innerHTML = buttonText;

        if (state.hideWhenSubscribed && state.isPushEnabled) {
            element.style.display = "none";
        } else {
            element.style.display = "";
        }
    });
}

function getSubscriptionState() {
    return Promise.all([
      OneSignal.isPushNotificationsEnabled(),
      OneSignal.isOptedOut()
    ]).then(function(result) {
        var isPushEnabled = result[0];
        var isOptedOut = result[1];

        return {
            isPushEnabled: isPushEnabled,
            isOptedOut: isOptedOut
        };
    });
}