import {leagueData} from "../pages/data";
import React from "react";

export const LeagueTable = ({selectedSport}) => {
    // console.log('LEAUGE DATA', leagueData)
    // console.log(selectedSport)
    return(
    leagueData[selectedSport].map((group, groupIndex) => (
        <div key={groupIndex} className="group-section">
            <h2>{group.group}</h2>
            <table>
                <thead>
                <tr>
                    <th>학과</th>
                    <th>승</th>
                    <th>무</th>
                    <th>패</th>
                    <th>승점</th>
                </tr>
                </thead>
                <tbody>
                {group.teams.map((team, index) => (
                    <tr key={index}>
                        <td>{team.department}</td>
                        <td>{team.win}</td>
                        <td>{team.draw}</td>
                        <td>{team.lose}</td>
                        <td>{team.points}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    ))
    );
};