import React from 'react';
import "./home.css"

import { connect } from 'react-redux';

import { readUser } from '../../Redux/Reducers/user.reducer'

import { Card, Button } from 'antd';
import image from './homepage.jpg';

const env = require('../../env.json')

const Home =  ({ user }) => {

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

  const isLogedHome = () => (
    <div>
      <div className="homeZone">
          <p>Puedes pagar aquí para ser premiun o hacer un torneo de prueba</p>
      </div>
      <div className="homeButtons">
          <a href={`${env.URL}/api/paypal/payment/${user.id}`}><Button type="primary">Pagar premiun con paypal</Button></a>
          <a href="register"><Button type="primary">Hacer torneo de prueba</Button></a>
      </div>
    </div>
  )


  return(
    <Card className="home" bordered={false}>
      <div className="homePageImg" style={{backgroundImage:`url(${image})`}}></div>
      <h1 className="title">Web en la que podrás gestionar con facilidad tus torneos basado en el sistema suizo como emparejamiento</h1>
      <div className="homeBody">
        <p>Esto es una web hecha para organizar emparejamientos de torneos con el <a target="_blank" rel="noopener noreferrer" href="https://es.wikipedia.org/wiki/Sistema_suizo">sistema suizo</a>. Sirve para cualquier cosa en la que quieras usar este formato de emparejamiento, pero esta basado sobretodo para ajedrez.</p>
        <p>En esta web podrás gestionar siendo premiun todos los torneos que quieras sin limites de personas aunque se ofrece una versión gratuita de prueba de 1 torneo hasta 8 personas</p>
        {user ? user.ispremiun ? "" : isLogedHome() : isntLogedHome()}
      </div>
    </Card>
  )
}

const mapStateToProps =state => {
    return ({
      user:readUser(state)
    })
    
  }

  export default connect(mapStateToProps)(Home);