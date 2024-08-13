import {tournamentData} from "../pages/data";
import {Bracket} from "react-tournament-bracket";
import React from "react";


export const TournamentBracket = ({selectedSport}) => {
    const getBracketGames = () => {
        // console.log('TOURNAMENT DATA', tournamentData);
        // console.log('SELECTED SPORT', selectedSport);
        return tournamentData[selectedSport].flatMap(round =>
            round.matches.map(match => ({
                id: match.id,
                name: `Match ${match.id}`,
                scheduled: round.date,
                sides: {
                    home: {
                        team: { id: match.id * 2 - 1, name: match.team1 },
                        score: { score: match.score1 },
                    },
                    visitor: {
                        team: { id: match.id * 2, name: match.team2 },
                        score: { score: match.score2 },
                    },
                },
            }))
        );
    };
    const games = getBracketGames();
    if (!games.length) {
        return <div>토너먼트 데이터가 없습니다.</div>;
    }

    return (
        <div className="bracket-container">
            {games.map(game => (
                <Bracket key={game.id} game={game} />
            ))}
        </div>
    );
};