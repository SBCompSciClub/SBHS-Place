import React, { Component } from 'react';
import configuration from './configuration.json';
import { Jumbotron, Button } from 'reactstrap';
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
        /**
         * Default Public Variables
         */
        this.update = false;
        this.cellWidth = 100;
        this.cellHeight = 100;
        this.max = 6;
        this.perRow = 2;
        /**
         * Initialize Firebase
         */
        this.firebaseInitialize(configuration);
        this.firebaseGetData("/private/", (e) =>
        {
            this.update = e.update;
            this.cellWidth = e.cell.width;
            this.cellHeight = e.cell.height;
            this.max = e.cell.max;
            this.perRow = e.cell.perRow;
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
                <Jumbotron>
                <h1 className="display-3">Hello, world!</h1>
                <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-2" />
                <p>It uses utility classes for typgraphy and spacing to space content out within the larger container.</p>
                <p className="lead">
                  <Button color="primary">Learn More</Button>
                </p>
              </Jumbotron>
            </div>
        );
    }
}
export default App;