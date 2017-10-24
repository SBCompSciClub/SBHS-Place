window.addEventListener("_event_onInitializeFirebase", (event) =>
{
    firebase.initializeApp(event.detail.configuration);
    let test = firebase.database().ref("/");
});
window.addEventListener("_event_onSetData", (event) =>
{
    firebase.database().ref(event.detail.reference).set(event.detail.data);
});
window.addEventListener("_event_onGetData", (event) =>
{
    let sent = false;
    firebase.database().ref(event.detail.reference).on("value", (e) =>
    {
        if (!sent)
        {
            sent = true;
            event.detail.callback(e.val());
        }    
    }); 
});