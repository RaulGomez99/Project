import React from 'react';
import { Radio } from 'antd';

import Cookies from 'universal-cookie';

import ErrorManager from '../../errorManager';

const env = require('../../env.json');

const TournamentMatch = ({ match, id }) => {
    const getDefaultValue = () => {
        if(match.home.points==1) return "1";
        if(match.away.points==1) return "-1";
        if(match.home.points==0.5) return "0";
        return null;
    }

    const sendPairResult = async (e) => {
        const matchSend = match;
        const { value } = e.target;
        matchSend.home.points = value ==  1 ? 1 : value == 0 ? 0.5 : 0;
        matchSend.away.points = value == -1 ? 1 : value == 0 ? 0.5 : 0;

        const cookies = new Cookies();
        const token = cookies.get('jwt');
        const json = await fetch(`${env.URL}/api/tournaments/pairResult/${id}`, {
            method: 'POST',
            body: JSON.stringify(matchSend),
            headers: {
                "Content-Type": "application/json",
                authtoken: token
            }
        });
        const resp = await json.json();
        if(resp.msg) return ErrorManager(resp.msg);
        console.log(resp)
    }

    return (
        <div className="match">
            <Radio.Group defaultValue={getDefaultValue()} onChange={sendPairResult}>
                <Radio.Button value="1" className="white">{match.home.id}</Radio.Button>
                <Radio.Button value="0" className="gray">Tablas</Radio.Button>
                <Radio.Button value="-1" className="black">{match.away.id}</Radio.Button>
            </Radio.Group>
        </div>
    )
}

export default TournamentMatch;