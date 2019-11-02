import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem} from '@ionic/react';
import React, { Component } from 'react';
import { firestore } from '../firebase/FirebaseConf';

export interface HomeProps {id: string}

interface HomeState {count: number, listener: () => void}

class Home extends React.Component<HomeProps, HomeState> {

  constructor(props: HomeProps) {
    super(props);

    this.state = {
      count: 0,
      listener: () => {}
    }
  }

  attachListener = () => {
    let self = this;
    return firestore.collection("count").doc("1").onSnapshot(function(snapshot) {
        let c = snapshot.get("count")
        self.setState({
          count: c
        })
    })
  }

  componentDidMount() {
    this.setState({
      listener: this.attachListener()
    })
  }

  handleIncrement = () => {
    let self = this;
    let c = self.state.count;
    c += 1;
    firestore.collection("count").doc("1").set({count: c})
    firestore.collection("count").doc("1").collection("arrivals").add({time: Date.now()})
  }

  handleDecrement = () => {
    let self = this;
    let c = self.state.count;
    c -= 1;
    firestore.collection("count").doc("1").set({count: c})
    firestore.collection("count").doc("1").collection("arrivals").orderBy("time", "desc").limit(1).get().then(function(d) {
      let id = d.docs[0].id
      firestore.collection("count").doc("1").collection("arrivals").doc(id).delete()
    })
  }

  render() {

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Counce</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{textAlign:"center", fontSize:36+"px"}}>{this.state.count}</div>
          <IonButton expand="full" color="success" onClick={this.handleIncrement}>One More</IonButton>
          <div style={{height: 100+"px"}}></div>
          <IonButton expand="full" color="warning" onClick={this.handleDecrement}>One Less</IonButton>
        </IonContent>
      </IonPage>
    );
  }
};

export default Home;
