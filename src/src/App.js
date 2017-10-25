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
        this.createElements = this.createElements.bind(this);
        /**
         * Listeners
         */
        let forceRefresh = () =>
        {
            this.createElements(this.private);            
        }
        window.addEventListener("resize", forceRefresh);
        window.addEventListener("_event_onRefresh", forceRefresh);
    }
    componentWillMount()
    {
        /**
         * Initial State
         */
        this.setState({
            update: false,
            elements: []
        });
        /**
         * Initialize Firebase
         */
        this.firebaseInitialize(configuration);
        this.firebaseGetData("/private/", (e) =>
        {
            this.private = e;
            this.createElements(e);
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
    createElements(e)
    {
        let elements = [];
        let x = 0;
        let y = 0;
        let returned = 0;
        this.firebaseGetData("/public/cells/", (rawData) =>
        {
            for (let i = 0; i < e.cell.max; i++)
            {
                if (i % e.cell.perRow == 0 && i != 0)
                {
                    x = 0;
                    y++;
                }
                let top = (y * (e.cell.height + 1)); // center factor: (window.innerHeight / 2) - ((e.cell.max / (e.cell.perRow * 2)) * (e.cell.height + 1)) + 
                let left = (x * (e.cell.width + 1)); // center factor: (window.innerWidth / 2) - ((e.cell.perRow / 2) * (e.cell.width + 1)) +
                let html = "";
                if (rawData[i] != null)
                {
                    html = rawData[i];
                    while (html.includes("alert("))
                    {
                        html = html.replace("alert(", "console.log(");
                    }
                }
                returned++;
                elements.push(<div style={{ position: "absolute", top: top, left: left, width: e.cell.width, height: e.cell.height, backgroundColor: "rgba(240, 240, 240, 1)" }} dangerouslySetInnerHTML={{ __html: html }} onClick={(e) =>
                {
                    
                }}></div>);
                if (returned == e.cell.max)
                {
                    this.setState({
                        update: e.update,
                        elements: elements
                    });
                }
                x++;
            }
        });
    }
    render()
    {
        let left = 0;
        let top = 0;
        if (this.private)
        {
            left = (window.innerWidth / 2) - ((this.private.cell.perRow / 2) * (this.private.cell.width + 1));
            top = (window.innerHeight / 2) - ((this.private.cell.max / (this.private.cell.perRow * 2)) * (this.private.cell.height + 1));
            if (left < 0)
            {
                left = 0;
            }    
            if (top < 0)
            {
                top = 0;
            }    
        }    
        return (
            <div>
                <div style={{ position: "absolute", top: top, left: left}}>
                    {this.state.elements}
                </div>    
            </div>
        );
    }
}
export default App;