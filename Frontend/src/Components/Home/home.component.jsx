import React from 'react';
import "./home.css"
import { BrowserRouter as Router} from 'react-router-dom';

import { connect } from 'react-redux';
import ErrorManager from '../../errorManager';
import Cookies from 'universal-cookie';
import { readUser, readTournament } from '../../Redux/Reducers/user.reducer'
import { addTournament, selectTournament } from '../../Redux/Actions/user.action'

import { Card, Button } from 'antd';
import image from './homepage.jpg';
import Tournament from '../TournamentEditor/tournamenteditor.component';

const env = require('../../env.json')

const Home =  ({ user, addTournament, selectTournament, tournament }) => {

  const isntLogedHome = () => (
    <div>
      <div className="homeZone">
          <p>Puedes loguearte o hacerte una cuenta totalmente gratuita</p>
      </div>
      <div className="homeButtons">
          <a href="login"><Button type="primary">Log in</Button></a>
          <a href="register"><Button type="primary">Register</Button></a>
      </div>
    </div>
  )

  const tournamentPrueba = async () => {
    if(!user.tournaments.length){
        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const data = {tournament:{name:"Test"}};
        const json = await fetch(`${env.URL}/api/tournaments`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        addTournament(resp);
        window.location.reload(false);
      }else{
        if(user.tournaments[0].state<0) {window.location.href="/tournament/"+user.tournaments[0].id}
        else setTimeout(()=>selectTournament(user.tournaments[0].id),200) 
      }
  }

  const isLogedHome = () => (
    <div>
      <div className="homeZone">
          <p>Puedes pagar aquí para ser premiun o hacer un torneo de prueba</p>
      </div>
      <div className="homeButtons">
          <a href={`${env.URL}/api/paypal/payment/${user.id}`}><Button type="primary">Pagar premium con paypal</Button></a>
          <Button type="primary" onClick={tournamentPrueba}>{user.tournaments.length ? "Ir al" : "Crear"} torneo de prueba</Button>
      </div>
    </div>
  )


  return(
    <Card className="home" bordered={false}>
      {tournament ? <Tournament /> : <div>
      <div className="homePageImg" style={{backgroundImage:`url(${image})`}}></div>
      <h1 className="title">Web en la que podrás gestionar con facilidad tus torneos basado en el sistema suizo como emparejamiento</h1>
      <div className="homeBody">
        <p>Esto es una web hecha para organizar emparejamientos de torneos con el <a target="_blank" rel="noopener noreferrer" href="https://es.wikipedia.org/wiki/Sistema_suizo">sistema suizo</a>. Sirve para cualquier cosa en la que quieras usar este formato de emparejamiento, pero esta basado sobretodo para ajedrez.</p>
        <p>En esta web podrás gestionar siendo premiun todos los torneos que quieras sin limites de personas aunque se ofrece una versión gratuita de prueba de 1 torneo hasta 8 personas</p>
        {user ? user.ispremiun ? "" : isLogedHome() : isntLogedHome()}
      </div></div>}
    </Card>
  )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state), tournament:readTournament(state)
    })
    
  }

  export default connect(mapStateToProps, { addTournament, selectTournament })(Home);