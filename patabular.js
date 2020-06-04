function getMatchups(options, round, participants, matches) {
    matches = matches.filter(match => match.round < round)
    var mappings = getMappings(participants, matches)

    var mapIds = new Map()
    var index = 0
    for (var m of mappings) {
      mapIds.set(index, m.id)
      m.id = index++
    }
  
    mappings = mappings.filter(m => !m.droppedOut)
  
    if(mappings.length % 2 === 1) {

      mappings.push({id: index,
        points: 0,
        seed: 0,
        tiebreaker: 0,
        opponents: mappings.filter(m => {
          return m.opponents.filter(o => o === null).length > 0
        }).map(m => mapIds.get(m.id))
      })
      mapIds.set(index, null)
    }

    mappings = shuffle(mappings, round, options.seedMultiplier)
    var arr = mappings.reduce((arr, team, i, orig) => {
      var opps = orig.slice(0, i).concat(orig.slice(i + 1))
      for (var opp of opps) {
        arr.push([
            team.id,
            opp.id,
            -1 * (Math.pow(team.points - opp.points, options.standingPower) +
              options.rematchWeight * team.opponents.reduce((n, o) => {
                return n + (o === mapIds.get(opp.id))
              }, 0))
        ])
      }
      return arr
    }, [])
  
    var results = blossom(arr, true)
    var matchups = []
    // Here we sort matchups by standings so that matchups and standings follow
    // roughly the same order - this doesn't impact funcitonality at all
    // Ordering this in the view layer should be possible, so let's move it there
    // pending review
    var standings = getStandings(options, round, participants, matches)
    var sortedKeys = [...mapIds.keys()].sort((a, b) => {
      // Float BYEs to the end
      if (mapIds.get(a) === null) {
        return 1
      } else if (mapIds.get(b) === null) {
        return -1
      }
      return standings.findIndex(s => s.id === mapIds.get(a)) -
        standings.findIndex(s => s.id === mapIds.get(b))
    })
    for(var i of sortedKeys) {
      if(results[i] !== -1 && !matchups.reduce(
        (n, r) => n || r.home === mapIds.get(results[i]),
        false)) {
        matchups.push({
          home: mapIds.get(i),
          away: mapIds.get(results[i])
        })
      }
    }
    return matchups
  }