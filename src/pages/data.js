import userImage from '../assets/user-image.png';

export const leagueData = {
  soccer: [
    {
      group: 'A조',
      teams: [
        { id: 1, department: '컴퓨터공학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 2, department: '생활체육학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 3, department: '화학생명공학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 4, department: '건축학과', win: 2, draw: 1, lose: 0, points: 7 }
      ]
    },
    {
      group: 'B조',
      teams: [
        { id: 1, department: '컴퓨터공학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 2, department: '생활체육학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 3, department: '화학생명공학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 4, department: '건축학과', win: 2, draw: 1, lose: 0, points: 7 }
      ]
    },
    {
      group: 'C조',
      teams: [
        { id: 1, department: '컴퓨터공학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 2, department: '생활체육학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 3, department: '화학생명공학과', win: 2, draw: 1, lose: 0, points: 7 },
        { id: 4, department: '건축학과', win: 2, draw: 1, lose: 0, points: 7 }
      ]
    }
  ],
  basketball: [
    {
      group: 'A조',
      teams: [
        { id: 1, department: '경영학과', win: 3, draw: 0, lose: 0, points: 9 },
        { id: 2, department: '심리학과', win: 1, draw: 1, lose: 1, points: 4 },
        { id: 3, department: '경제학과', win: 1, draw: 0, lose: 2, points: 3 },
        { id: 4, department: '사회학과', win: 0, draw: 1, lose: 2, points: 1 }
      ]
    }
  ]
};
export const tournamentData = {
  soccer: [
    {
      id: 1,
      name: 'Round 1 - Match 1',
      nextMatchId: 5,
      tournamentRoundText: 'Round 1',
      startTime: '2024-07-16T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '1', resultText: '3', isWinner: true, status: 'PLAYED', name: '컴퓨터공학과', image: userImage },
        { id: '2', resultText: '1', isWinner: false, status: 'PLAYED', name: '생활체육학과', image: userImage }
      ]
    },
    {
      id: 2,
      name: 'Round 1 - Match 2',
      nextMatchId: 5,
      tournamentRoundText: 'Round 1',
      startTime: '2024-07-16T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '3', resultText: '2', isWinner: true, status: 'PLAYED', name: '화학생명공학과', image: userImage },
        { id: '4', resultText: '1', isWinner: false, status: 'PLAYED', name: '건축학과', image: userImage }
      ]
    },
    {
      id: 3,
      name: 'Round 1 - Match 3',
      nextMatchId: 6,
      tournamentRoundText: 'Round 1',
      startTime: '2024-07-16T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '5', resultText: '3', isWinner: true, status: 'PLAYED', name: '경영학과', image: userImage },
        { id: '6', resultText: '2', isWinner: false, status: 'PLAYED', name: '디자인학과', image: userImage }
      ]
    },
    {
      id: 4,
      name: 'Round 1 - Match 4',
      nextMatchId: 6,
      tournamentRoundText: 'Round 1',
      startTime: '2024-07-16T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '7', resultText: '3', isWinner: true, status: 'PLAYED', name: '음악학과', image: userImage },
        { id: '8', resultText: '2', isWinner: false, status: 'PLAYED', name: '기계공학과', image: userImage }
      ]
    },
    {
      id: 5,
      name: 'Round 2 - Match 1',
      nextMatchId: 7,
      tournamentRoundText: 'Round 2',
      startTime: '2024-07-17T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '1', resultText: '3', isWinner: true, status: 'PLAYED', name: '컴퓨터공학과', image: userImage },
        { id: '3', resultText: '1', isWinner: false, status: 'PLAYED', name: '화학생명공학과', image: userImage }
      ]
    },
    {
      id: 6,
      name: 'Round 2 - Match 2',
      nextMatchId: 7,
      tournamentRoundText: 'Round 2',
      startTime: '2024-07-17T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '5', resultText: '3', isWinner: true, status: 'PLAYED', name: '경영학과', image: userImage },
        { id: '7', resultText: '2', isWinner: false, status: 'PLAYED', name: '음악학과', image: userImage }
      ]
    },
    {
      id: 7,
      name: 'Final - Match',
      nextMatchId: null,
      tournamentRoundText: 'Final',
      startTime: '2024-07-18T12:00:00Z',
      state: 'DONE',
      participants: [
        { id: '1', resultText: '3', isWinner: true, status: 'PLAYED', name: '컴퓨터공학과', image: userImage },
        { id: '5', resultText: '2', isWinner: false, status: 'PLAYED', name: '경영학과', image: userImage }
      ]
    }
  ],
  basketball: [

  ]
};