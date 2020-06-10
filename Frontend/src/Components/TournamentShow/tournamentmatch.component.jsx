import React from 'react';

const TournamentMatch = ({ match }) => {
    const selected = "ant-radio-button-wrapper-checked";

    return (
        <div className="match">
            <h2>Mesa {match.table}</h2>
            <label class={`${match.home.points==1   ? selected : "white"} ant-radio-button-wrapper`}><span>{match.home.id}</span></label>
            <label class={`${match.home.points==0.5 ? selected : "gray" } ant-radio-button-wrapper`}><span>{  "Tablas"   }</span></label>
            <label class={`${match.away.points==1   ? selected : "black"} ant-radio-button-wrapper`}><span>{match.away.id}</span></label>
        </div>
    )
}

export default TournamentMatch;