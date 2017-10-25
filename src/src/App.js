import React, { Component } from 'react';
import configuration from './configuration.json';
import { ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap';
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
        this.inputToggle = this.inputToggle.bind(this);
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
            elements: [],
            input: false
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
        this.firebaseGetData("/private/", (event) =>
        {
            this.private = event;
        });
        this.firebaseGetData("/public/cells/", (rawData) =>
        {
            for (let i = 0; i < e.cell.max; i++)
            {
                if (i % e.cell.perRow === 0 && i !== 0)
                {
                    x = 0;
                    y++;
                }
                let top = (y * (e.cell.height)); // center factor: (window.innerHeight / 2) - ((e.cell.max / (e.cell.perRow * 2)) * (e.cell.height + 1)) +
                let left = (x * (e.cell.width)); // center factor: (window.innerWidth / 2) - ((e.cell.perRow / 2) * (e.cell.width + 1)) +
                let html = "";
                let enabled = true;
                let epochNow = Math.round((new Date()).getTime() / 1000);
                if (rawData[i] != null)
                {
                    html = rawData[i].html;
                    while (html.includes("alert("))
                    {
                        html = html.replace("alert(", "console.log(");
                    }
                    if (epochNow <= rawData[i].time + 60)
                    {
                        enabled = false;
                    }
                }
                returned++;
                if (enabled)
                {
                    elements.push(<ListGroupItem tag="a" action style={{ position: "absolute", top: top, left: left, width: e.cell.width, height: e.cell.height, padding: 0, userSelect: "none", cursor: "default", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: html }} onClick={(e) =>
                    {                        
                        let html = "";
                        if (rawData[i])
                        {
                            html = rawData[i].html;
                        }    
                        this.setState({
                            currentText: html,
                            currentIndex: i,
                            input: true
                        })
                        this.createElements(this.private);
                    }}></ListGroupItem >);
                }
                else if (!enabled)
                {
                    elements.push(<ListGroupItem tag="a" disabled style={{ position: "absolute", top: top, left: left, width: e.cell.width, height: e.cell.height, padding: 0, userSelect: "none", cursor: "not-allowed", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: html }}></ListGroupItem >);
                }
                if (returned === e.cell.max)
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
    inputToggle()
    {
        this.setState({
            input: !this.state.input
        });
    }
    render()
    {
        let left = 0;
        let top = 0;
        let hei = 0;
        let wid = 0;
        if (this.private)
        {
            left = (window.innerWidth / 2) - ((this.private.cell.perRow / 2) * (this.private.cell.width));
            top = (window.innerHeight / 2) - ((this.private.cell.max / (this.private.cell.perRow * 2)) * (this.private.cell.height));
            if (left < 0)
            {
                left = 0;
            }
            if (top < 0)
            {
                top = 0;
            }
            hei = this.private.cell.height;
            wid = this.private.cell.width;
        }
        return (
            <div>
                <div style={{ position: "absolute", top: top, left: left}}>
                    {this.state.elements}
                </div>
                <Modal isOpen={this.state.input} toggle={this.inputToggle}>
                    <ModalHeader toggle={this.inputToggle}>Edit Cell</ModalHeader>   
                    <ModalBody>
                        <p className="lead" style={{ marginBottom: 0, paddingBottom: 0 }}>Preview</p>
                        <ListGroupItem tag="a" action style={{ width: wid, height: hei, padding: 0, marginBottom: 10, userSelect: "none", cursor: "default", overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: this.state.currentText }}></ListGroupItem>
                        <p className="lead" style={{ marginBottom: 0, paddingBottom: 0 }}>Code</p>
                        <Input type="textarea" value={this.state.currentText} name="text" placeholder="Enter HTML Code Here" onChange={(e) =>
                        {
                            this.setState({
                                currentText: e.target.value
                            });
                        }}>
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" outline onClick={(e) =>
                        {                            
                            let epochNow = Math.round((new Date()).getTime() / 1000);
                            if (this.private.update)
                            {
                                this.firebaseSetData("/public/cells/" + this.state.currentIndex + "/", {
                                    html: this.state.currentText,
                                    time: epochNow
                                });
                                this.createElements(this.private);
                            }    
                            this.inputToggle();
                        }}>Save</Button>
                    </ModalFooter>
                </Modal>                
                <p style={{ position: "fixed", bottom: 0, right: 0, padding: 0, margin: 0, fontSize: 10 }}>Created By Shivan Modha</p>
            </div>
        );
    }
}
export default App;