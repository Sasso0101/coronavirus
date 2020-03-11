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
    var subscribeText = "🔔 Clicca <span>qui</span> per ricevere le notifiche con tutti gli aggiornamenti!";
    var unsubscribeText = "Annulla iscrizione alle notifiche live";

    var element = document.querySelector(buttonSelector);
    if (element === null) {
        return;
    }

    getSubscriptionState().then(function(state) {
        if (!state.isPushEnabled || state.isOptedOut) {
            var buttonText = subscribeText;
        }
        else {
            var buttonText = unsubscribeText;
            element.style.backgroundColor = '';
            element.style.color = '#ffffff';
            element.style.color = '#ffffff';
            element.style.margin = '10px auto';
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