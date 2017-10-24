import React, { Component } from 'react';
import configuration from './configuration.json'
class App extends Component
{
    constructor()
    {
        super();
        /**
         * Binding
         */
        this.firebaseInitialize = this.firebaseInitialize.bind(this);
        this.firebaseSetData = this.firebaseSetData.bind(this);
        this.firebaseGetData = this.firebaseGetData.bind(this);


        this.firebaseInitialize(configuration);
        this.firebaseGetData("/private/", (e) =>
        {
            console.log(e);
        });
    }
    firebaseInitialize(configuration)
    {
        window.dispatchEvent(new CustomEvent("_event_onInitializeFirebase", { detail: { configuration: configuration } }));
    }
    firebaseSetData(reference, data)
    {
        window.dispatchEvent(new CustomEvent("_event_onSetData", { detail: { reference: reference, data: data } }));
    }
    firebaseGetData(reference, callback)
    {
        window.dispatchEvent(new CustomEvent("_event_onGetData", { detail: { reference: reference, callback: callback } }));
    }
    render()
    {
        return (
            <div className="App">
                Shivan
            </div>
        );
    }
}
export default App;