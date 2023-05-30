addLayer("p", {
    name: "Primordial Essence", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
		  	best: new Decimal(0),
			  total: new Decimal(0),
        time: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Primordial Essence", // Name of prestige currency
    baseResource: "Existence Shards", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('p', 15)) mult = mult.div(upgradeEffect('p', 15))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasUpgrade('p',13)) exp = exp.times(player.p.points.add(0.75).pow(0.8).div(player.p.points.add(player.p.points.pow(0.05).add(0.005))))
        if (hasUpgrade('sp',11)) exp = exp.times(0.95)
        if (hasChallenge("sp",12)) exp = exp.times(1.1)
        return exp
    },
    effectDescription() {
			return "which are multiplying E.S. gain by "+format(player.p.points.add(1).pow(1.05))+"x"
		},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Primordial Essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
      upgrades: {11: {title: "Fabric of Everything",
    description: "Decuple your Existence Shard gain.",
    cost: new Decimal(2),       
     },          12: {title: "Reality Formation",
    description: "Multiply your Existence Shard gain by Primordial Essence.",
    cost: new Decimal(4),
        effect() {
       return player[this.layer].points.add(1).pow(0.7)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
     },          13: {title: "Space-Time Formation",
    description: "Multiply your Existence Shard gain by itself, but harden P.E. requirement based on itself.",
    cost: new Decimal(6),
        effect() {
        return player.points.plus(1).log2().pow(2).div(6).times(upgradeEffect('p',14)).plus(1)
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
     },          14: {title: "Density Growth",
    description: "Enhance <h3>Space-Time Formation</h3> first effect by Primordial Essence.",
    cost: new Decimal(8),    
        effect() { return player.p.points.add(1).log2()
    },
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
     },           15: {title: "Singularity Formation",
    description: "Divide Primordial Essence requirement by Existence Shard at increased rate.",
    cost: new Decimal(12),    
        effect() {
        return player.points.add(1).pow(0.3)
    },
    effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
     },          31: {title: "Theory of Aether",
    description: "Unlock the Aether.",
    cost: new Decimal(25),
		unlocked() {return !player.a.unlocked },
     },
    }, 
  	doReset(resettingLayer) {
			let keep = [];
			if (hasMilestone("sp", 0) && resettingLayer=="sp") keep.push("milestones")
      if (hasMilestone("sp", 0) && (hasChallenge("sp",21)) && resettingLayer=="sp") keep.push("upgrades","milestones")
			if (hasMilestone("t", 0) && resettingLayer=="t") keep.push("milestones")
      if (hasMilestone("t", 0) && (hasChallenge("sp",21)) && resettingLayer=="t") keep.push("upgrades","milestones")
    	if (hasMilestone("t", 0) && resettingLayer=="a") keep.push("milestones")
      if (hasUpgrade('a',12) && (hasChallenge("sp",21)) && resettingLayer=="a") keep.push("upgrades","milestones")
			if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)},
   milestones: {
    0: {
        requirementDescription: "Primal Reality (5 Primordial Essence)",
        effectDescription: "Unlock Space and Time layers",
        done() { return player.p.best.gte(5)},
    },
   },
})

addLayer("sp", {
    name: "Space", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Sp", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
			  unlockOrder: 0,
    }},
    color: "#BB00FF",
    requires() { return new Decimal(10).times((player.sp.unlockOrder&&!player.sp.unlocked)?1.5:1)},// Can be a function that takes requirement increases into account
    resource: "Space", // Name of prestige currency
    baseResource: "Primordial Essence", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    resetTime() {},
    row: 1, // Row the layer is in on the tree (0 is the first row)
		increaseUnlockOrder: ["t"],
    branches: [["p","#dd80ff"]],
    hotkeys: [
        {key: "s", description: "S: Reset for Space", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (hasMilestone("p", 0))},
    upgrades: {
     11: {title: "Theory of Shards",
    description: "Multiply Existence Shard gain by number, which based on itself, Space and Time, but harden P.E. requirement.",
    cost: new Decimal(1),
          effect() {
          return player.points.add(player.sp.points.add(player.t.points).add(0.1)).pow(0.15)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
     },
     21: {title: "Theory of Everything",
    description: "Unlock the Force [W.I.P.!]",
    
    cost: new Decimal(10),
     },
    },
    milestones: {
    0: {
        requirementDescription: "Big Bang (1 Space)",
        effectDescription: "Keep Primordial Essence milestones on Space reset",
        done() { return player.sp.points.gte(1)},
    },
   },
    doReset(resettingLayer) {
			let keep = [];
			if (layers[resettingLayer].row > this.row) layerDataReset("sp", keep)},
		challenges: {
      rows: 2,
      cols: 3,
			11: {
				name: "Existence Weakening",
				completionLimit: 1,
				challengeDescription: "Existence Shard gain is brought to 4th root.",
				unlocked() { return player.sp.unlocked },
        canComplete: function() {return player.p.points.gte(7)},
				goal() { return new Decimal(player.p.current=="p"?"5":"7") },
				currencyDisplayName: "Primordial Essence",
				currencyInternalName: "Primordial Essence",
				rewardDescription: "Raise Existence Shard gain (before upgrades) to 1.15.",
        },
			12: 
      {
				name: "Anti-shard Supremacy",
				completionLimit: 1,
				challengeDescription: "Existence Shard gain is divides over time by itself.",
				unlocked() { return (hasChallenge("sp", 11)) },
        canComplete: function() {return player.points.gte(1000)},
				goal() { return new Decimal(player.current=="p"?"5":"1000") },
				currencyDisplayName: "Existence Shards",
				currencyInternalName: "Existence Shards",
				rewardDescription: "Weaken the P.E. requirement.",
        },
      13: {
				name: "Shattered Existence",
				completionLimit: 1,
				challengeDescription: "Existence Weakening and Anti-shard Supremacy challenges are applied at once, and they are stronger. Entering this challenge will unlock another row1 layer.",
				unlocked() { return (hasChallenge("sp", 12)) },
        canComplete: function() {return player.points.gte(5000)},
				goal() { return new Decimal(player.current=="p"?"5":"5000") },
				currencyDisplayName: "Existence Shards",
				currencyInternalName: "Existence Shards",
				rewardDescription() { return "Add "+format(player.points.add(1).pow(0.05))+" to Existence Shard gain base."},
        },
      21: {
				name: "Existenceless",
				completionLimit: 1,
        challengeDescription: "Existence Shard gain is 5000^-0.5. Entering this challenge will unlock BH and EE layers. Rewards from previous challenges is disabled.",
				unlocked() { return (hasChallenge("sp", 13)) },
        canComplete: function() {return player.points.gte(100)},
				goal() { return new Decimal(player.current=="p"?"5":"100") },
				currencyDisplayName: "Existence Shards",
				rewardDescription() { return "Add "+format(player.points.add(1).pow(0.005))+" to Existence Shard exponent and keep BH layer on complete. And finally, keep PE upgrades all row2 resets!"},
        },
},  
})

addLayer("t", {
    name: "Time", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
	    	points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: 0,
			  unlockOrder: 0,
    }},
    color: "#0066FF",
    requires() { return new Decimal(10).times((player.t.unlockOrder&&!player.t.unlocked)?1.5:1)}, // Can be a function that takes requirement increases into account
    resource: "Time", // Name of prestige currency
    baseResource: "Primordial Essence", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
		increaseUnlockOrder: ["sp"],
    branches: [["p","#80b3ff"]],
    hotkeys: [
        {key: "t", description: "T: Reset for Time", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    getTSPUpgsDil() {
      let dil = new Decimal(1)
        if (hasUpgrade('t',11)) dil = dil.times(1e5)
        if (hasUpgrade('sp',12)) dil = dil.times(1e7)
        if (hasUpgrade('t',13)) dil = dil.times(1e10)
        if (hasUpgrade('sp',14)) dil = dil.times(1e13)
        if (hasUpgrade('t',15)) dil = dil.times(1e15)
      return dil
    },
    layerShown(){return (hasMilestone("p", 0))},
    upgrades: 
    {  11: {title: "Theory of Big Bang",
    description: "Dilate the hardcap start by 1e5.",
    cost: new Decimal(2),
		unlocked() {return (hasMilestone("t", 1)) },
     },12: {title: "Theory of Everyone",
    description: "Raises Existence Shard gain after softcap to ^1.15.",
    cost: new Decimal(3),
		unlocked() {return (hasUpgrade('t',11)) },
     },13: {title: "Theory of Everyone",
    description: "Unlock the Soul [W.I.P.!]",
    cost: new Decimal(4),
		unlocked() {return (hasUpgrade('t',12)) },
     },14: {title: "Time Ascension",
    description: "Allows you to see the current <h3>hardcap</h3> start",
    cost: new Decimal(5),
		unlocked() {return (hasUpgrade('t',13)) },
     },21: {title: "Theory of Everyone",
    description: "Unlock the Soul [W.I.P.!]",
    cost: new Decimal(10),
     },
   },
    milestones: {
    0: {requirementDescription: "Primal Time (1 Time)",
        effectDescription: "Keep Primordial Essence milestones on Time reset",
        done() {return player.t.points.gte(1)},
    },
    1: {requirementDescription: "Sundial (2 Time)",
        effectDescription: "Unlock first row of upgrades",
        done() {return player.t.points.gte(2)},
    },
  },
    doReset(resettingLayer) {
			let keep = [];
			if (layers[resettingLayer].row > this.row) layerDataReset("t", keep)},
})

addLayer("a", {
    name: "Aether", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
        energy: new Decimal(0),
    }},
    color: "#BB00BB",
    requires: new Decimal(16384), // Can be a function that takes requirement increases into account
    resource: "Aether", // Name of prestige currency
    baseResource: "Existence Shards", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('a',22)) mult = mult.div(upgradeEffect("a",15))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    canBuyMax() {return (hasUpgrade('a',13))},
    getShDist() {
        let dist = new Decimal(8.8e26)
        if (hasUpgrade('a',11)) dist = dist.div(upgradeEffect("a",11))
        if (hasUpgrade('a',12)) dist = dist.div(upgradeEffect("a",12))
        if (hasUpgrade('a',13)) dist = dist.div(upgradeEffect("a",13))
        if (hasUpgrade('a',14)) dist = dist.div(upgradeEffect("a",14))
        if (hasUpgrade('a',15)) dist = dist.div(upgradeEffect("a",15))
        if (hasUpgrade('a',21)&&(tmp.a.getBE.lte(1e9))) dist = dist.div((tmp.a.getBE).pow(0.5))
        if (hasUpgrade('a',21)&&(tmp.a.getBE.gte(1e9))) dist = dist.div((tmp.a.getBE).pow(0.1))
        return dist
    },
    getShDistEff() {
        let eff = tmp.a.getShDist.div(8.8e26).pow(-0.05).max(1)
        if (eff.gte(1.2)) eff = eff.div(1.2).pow(0.5).mul(1.2)
        if (eff.gte(1.4)) eff = eff.div(1.4).pow(0.45).mul(1.4)
        if (eff.gte(1.6)) eff = eff.div(1.6).pow(0.40).mul(1.6)
        return eff
    },
    getShDistRatio() {
      let dist = new Decimal(8.8e26)
      let dist1 = tmp.a.getShDist.max(1)
      let ratio = dist.div(dist1).max(1)
      return ratio
    },
    getHCStart() {
      let HC = getPointCap()
      let HCS = 1e10
      let ratio = getPointCap().div(HCS)
      return ratio
    },
    getAetBoost() {
        let eff = new Decimal(1)
        if (hasUpgrade('a',21)) eff = eff.times(upgradeEffect("a",21))
        if (hasUpgrade('a',22)) eff = eff.times(upgradeEffect("a",22))
        if (hasUpgrade('a',23)) eff = eff.times(upgradeEffect("a",23))
        return eff
    },
    getBE() {
        let eff = new Decimal(1)
        if (player.a.buyables[11]) eff = eff.times(buyableEffect("a",11))
        if (player.a.buyables[12]) eff = eff.times(buyableEffect("a",12))
        if (player.a.buyables[13]) eff = eff.times(buyableEffect("a",13))
        return eff
    },
    getBE2() {
        let eff = new Decimal(1)
        if (player.a.buyables[21]) eff = eff.times(buyableEffect("a",21))
        if (player.a.buyables[22]) eff = eff.times(buyableEffect("a",22))
        if (player.a.buyables[23]) eff = eff.times(buyableEffect("a",23))
        return eff
    },
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "a") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "a") return "resource-display"},
            "blank",
            ["raw-html",
                    function () {
                        if (player.tab == "a") {
                            let a = "You have <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+formatWhole(player.a.points)+"</h2> Aethers<br>"
                            let b = "The distance between shards is <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+distShort(tmp.a.getShDist)+"</h2>, which dilates Existence Shards hardcap start by ^<h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+format(tmp.a.getShDistEff)+"</h2><br>"
                            let c = ""
                            if (hasUpgrade('a',14)) c = "Current ratio is: <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+format(tmp.a.getShDistRatio)+"</h2>"
                          return a+b+c
                        }
                    }],
            "blank",
            "upgrades",
            ]
        },"Buyables": {
        content:[
            function() {if (player.tab == "a") return "main-display"},
            "prestige-button",
            function() {if (player.tab == "a") return "resource-display"},
            "blank",
            ["raw-html",
                    function () {
                        if (player.tab == "a") {
                            let a = "You have <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+formatWhole(player.a.points)+"</h2> Aethers<br>"
                            let b = "The distance between shards is <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+distShort(tmp.a.getShDist)+"</h2>, which dilates Existence Shards hardcap start by ^<h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+format(tmp.a.getShDistEff)+"</h2><br>"
                            let c = ""
                            if (hasUpgrade('a',14)) c = "Current ratio is: <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+format(tmp.a.getShDistRatio)+"</h2>"
                          return a+b+c
                        }
                    }],
            "blank",
            "buyables",
            ]
        },
   },
    upgrades: 
    {  11: {title: "Shard Far-Out Convergence",
    description: "Reduce the distance between shards based on Spaces and Times.",
    cost: new Decimal(3),
            effect() {
          return (player.sp.points.add(player.t.points).add(1)).pow(0.1).times(tmp.a.getAetBoost)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },    
		unlocked() {return (player.a.unlocked) },
     },12: {title: "Aetherized Black Hole",
    description: "Reduce the distance between shards based on best B.H.m since last A. reset. Sp21 c.rew affect A. layer",
    cost: new Decimal(5),
            effect() {
          return (player.bh.best.add(1)).pow(0.01).times(tmp.a.getAetBoost)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',11)) },
     },13: {title: "Aetherized Existence",
    description: "Reduce the distance between shard based on E.S. and you can buy max Aethers.",
    cost: new Decimal(9),
            effect() {
          return (((player.points.add(1)).log2()).pow(0.1).add(0.01)).max(1).times(tmp.a.getAetBoost)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',12)) },
     },14: {title: "Equilibrium of Aether",
    description: "Reduice the distance between shard based on Aethers and you can see the current <h3>distance</h3> ratio.",
    cost: new Decimal(12),
            effect() {
          return (player.a.points.add(1)).pow(0.1).times(tmp.a.getAetBoost)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',13)) },
     },15: {title: "Across the Stars",
    description: "Reduice the distance between shard based on current distance ratio.",
    cost: new Decimal(15),
            effect() {
          return (tmp.a.getShDistRatio).pow(0.15).times(tmp.a.getAetBoost)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',14)) },
     },21: {title: "Stronger Convergence",
    description: "Enhance the row1 upgrades based on hardcap start.",
    cost: new Decimal(30),
            effect() {
          return (tmp.a.getHCStart.add(1)).log2().pow(0.35)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',15)) },
     },22: {title: "Stronger Aetherization",
    description: "Enhance the row1 upgrades based on R.BH mass. <h3>Across the Stars</h3> effect affects Aether req.",
    cost: new Decimal(35),
            effect() {
          return (player.bh.points.div(1e24).add(1)).pow(0.15).max(1)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',15)) },
     },23: {title: "Enhanced Existence",
    description: "Enhance the row1 upgrades based on <h3>Space-Time Formation</h3> effect.",
    cost: new Decimal(40),
            effect() {
          return (upgradeEffect('p',13)).pow(0.15)},
    effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return (hasUpgrade('a',15)) },
     },
   },
  buyables: {
        11: {
			title: "The Shard Attractor",
        cost(x) { return new Decimal(0).add(x) },
            base() { 
                return new Decimal(1.15)
            },
            total() {
                let total = getBuyableAmount("a", 11)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.a.buyables[11].total
                let base = tmp.a.buyables[11].base
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.a.buyables[11].cost)+" Aethers\n\
                Effect: " + format(tmp.a.buyables[11].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("a", 11))
            },
            unlocked() { return (hasUpgrade('a',21)) }, 
            canAfford() {
                    return player.a.points.gte(tmp.a.buyables[11].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
			title: "The Shard Attractor",
        cost(x) { return new Decimal(1e3).times(x).log2().pow(x.div(10)) },
            base() { 
                return new Decimal(1.1)
            },
            total() {
                let total = getBuyableAmount("a", 12)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.a.buyables[12].total
                let scs = 40
                let base = tmp.a.buyables[12].base
                if (x.gte(scs)) x = x.div(scs).pow(.5).times(scs)
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.a.buyables[12].cost)+" Black Hole masses\n\
                Effect: " + format(tmp.a.buyables[12].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("a", 12))
            },
            unlocked() { return getBuyableAmount("a", 11).gte(10) }, 
            canAfford() {
                    return player.bh.points.gte(tmp.a.buyables[12].cost)},
            buy() { 
                player.bh.points = player.bh.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        13: {
			title: "The Shard Attractor",
        cost(x) { return new Decimal(0).add(x).pow(x.div(2)) },
            base() { 
                return new Decimal(1.10)
            },
            total() {
                let total = getBuyableAmount("a", 13)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.a.buyables[13].total
                let base = tmp.a.buyables[13].base
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Require: " + format(tmp.a.buyables[13].cost)+" Distance Ratio\n\
                Effect: " + format(tmp.a.buyables[13].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("a", 13))
            },
            unlocked() { return getBuyableAmount("a", 12).gte(100) }, 
            canAfford() {
                    return tmp.a.getShDistRatio.gte(tmp.a.buyables[13].cost)},
            buy() { 
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        21: {
			title: "The Shard Attractor",
        cost(x) { return new Decimal(0).add(x) },
            base() { 
                return new Decimal(1.15)
            },
            total() {
                let total = getBuyableAmount("a", 11)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.a.buyables[21].total
                let base = tmp.a.buyables[21].base
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.a.buyables[21].cost)+" Aethers\n\
                Effect: " + format(tmp.a.buyables[21].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("a", 21))
            },
            unlocked() { return getBuyableAmount("a", 13).gte(10) }, 
            canAfford() {
                    return player.a.points.gte(tmp.a.buyables[21].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        22: {
			title: "The Shard Attractor",
        cost(x) { return new Decimal(1e3).times(x.pow(2)).log2().pow(x) },
            base() { 
                return new Decimal(1.1)
            },
            total() {
                let total = getBuyableAmount("a", 22)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.a.buyables[22].total
                let base = tmp.a.buyables[22].base
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.a.buyables[22].cost)+" Black Hole masses\n\
                Effect: " + format(tmp.a.buyables[22].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("a", 22))
            },
            unlocked() { return getBuyableAmount("a", 21).gte(10) }, 
            canAfford() {
                    return player.bh.points.gte(tmp.a.buyables[22].cost)},
            buy() { 
                player.bh.points = player.bh.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        23: {
			title: "The Shard Attractor",
        cost(x) { return new Decimal(0).add(x).pow(x) },
            base() { 
                return new Decimal(1.10)
            },
            total() {
                let total = getBuyableAmount("a", 23)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.a.buyables[23].total
                let base = tmp.a.buyables[23].base
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Require: " + format(tmp.a.buyables[23].cost)+" Distance Ratio\n\
                Effect: " + format(tmp.a.buyables[23].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("a", 13))
            },
            unlocked() { return getBuyableAmount("a", 22).gte(50) }, 
            canAfford() {
                    tmp.a.getShDistRatio.gte(tmp.a.buyables[23].cost)},
            buy() { 
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
  },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["sp","t"],
    hotkeys: [
        {key: "a", description: "A: Reset for Aether", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (hasUpgrade("p", 31)||player.a.unlocked)},
    doReset(resettingLayer) {
			let keep = [];
			if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)},
})
addLayer("f", {
    name: "Force", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
			  unlockOrder: 0,
    }},
    color: "#F56D53",
    requires() { return new Decimal(5).times((player.f.unlockOrder&&!player.f.unlocked)?2:1)}, // Can be a function that takes requirement increases into account
    resource: "Force", // Name of prestige currency
    baseResource: "Space", // Name of resource prestige is based on
    baseAmount() {return player.sp.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
		increaseUnlockOrder: ["s"],
    branches: [["sp","#d837a9"]],
    hotkeys: [
        {key: "f", description: "F: Reset for Force", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (hasUpgrade("sp", 21))},
})

addLayer("s", {
    name: "Soul", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
			  unlockOrder: 0,
    }},
    color: "#4BFC90",
    requires() { return new Decimal(5).times((player.s.unlockOrder&&!player.s.unlocked)?2:1)}, // Can be a function that takes requirement increases into account
    resource: "Soul", // Name of prestige currency
    baseResource: "Time", // Name of resource prestige is based on
    baseAmount() {return player.t.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
		increaseUnlockOrder: ["f"],
    branches: [["t","#26b1c8"]],
    hotkeys: [
        {key: "shift+s", description: "Shift+S: Reset for Soul", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return (hasUpgrade("t", 21))},
})
addLayer("ee", {
    name: "Existence Essence", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
        chalgoal: new Decimal(5000),
    }},
    color: "#BBBBBB",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Existence Essence", // Name of prestige currency
    baseResource: "Existence Shard", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.25, // Prestige currency exponent
    effectDescription() {
			return "which are adding "+format(player.ee.points.add(1).pow(0.1))+" to E.S. gain base."
		},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
       11: {title: "Weaken Shattering",
    description: "Existence Shard gain is multiplied by 1000.",
    cost: new Decimal(2500),  
    unlocked() { return (inChallenge("sp",13))},
     },12: {title: "Strengthen Existence",
    description: "Existence Shard gain is multiplied by 10000.",
    cost: new Decimal(7000),
    unlocked() { return (inChallenge("sp",13))},
     },13: {title: "Annihilate Anti-shards",
    description: "Existence Shard gain is multiplied by 100000.",
    cost: new Decimal(15000),
    unlocked() { return (inChallenge("sp",13))},
     },14: {title: "Decelerate Rift Formation",
    description: "Existence Shard gain is raised to 1.5.",
    cost: new Decimal(100000),
    unlocked() { return (inChallenge("sp",13))},
     },
    },
  buyables: {
        11: {
			title: "ES Gain",
        cost(x) { return new Decimal(2).pow(x.add(1).div(3)) },
            base() { 
                return new Decimal(1.05)
            },
            total() {
                let total = getBuyableAmount("ee", 11)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.ee.buyables[11].total
                let base = tmp.ee.buyables[11].base
                return (Decimal.pow(base,x));
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Multiply Existence Shard gain after challenge nerf by "+format(this.base())+".\n\
                Cost: " + format(tmp.ee.buyables[11].cost)+" Existence Essence\n\
                Effect: " + format(tmp.ee.buyables[11].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("ee", 11))
            },
            unlocked() { return inChallenge("sp",21) }, 
            canAfford() {
                    return player.ee.points.gte(tmp.ee.buyables[11].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
  },
    branches: [["p","#dddddd"]],
    hotkeys: [
        {key: "shift+c", description: "Shift+C: Reset for Existence Essence (works only in Shattered Existence challenge)", onPress(){if ((canReset(this.layer))&&(inChallenge("sp", 13))) doReset(this.layer)}},
    ],
    layerShown(){return (player.ee.unlocked&&((inChallenge("sp", 13)||inChallenge("sp", 21))))},
		passiveGeneration() { return (player.ee.unlocked&&((inChallenge("sp", 13)||inChallenge("sp", 21))))?0.25:0 },
})
addLayer("bh", {
    name: "Black Hole", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "BH", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
    }},
    color: "#222222",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Black Hole mass", // Name of prestige currency
    baseResource: "Existence Shard", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    effectDescription() {
      if (inChallenge("sp",21))
      return "which are adding "+format(player.bh.points.add(1).log2().div(1000))+" to E.S. gain base."
      if (hasChallenge("sp",21))
      return "which are adding "+format(player.bh.points.add(1).log10().div(2))+" to E.S. gain base outside the Existenceless challenge."
		},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge("sp",21)) exp = exp.times(10)
        if (player.bh.points.gte(9.945e74)) exp = exp.div(((player.points.log2()).div(500)).max(1.5))
        if (player.bh.points.gte(1e250)) exp = exp.times(0)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row) 
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "bh") return "main-display"},
            function() {if (player.tab == "bh") return "resource-display"},
            "blank",
            "upgrades",
            "buyables",
          ]},
        "Stats": { // From AD NG+++
            content:[
            "blank",
            ["raw-html", 
            function () {
                if (player.tab == "bh") { 
                let x = player.bh.points
                let mass = x.div(1e30)
                let sr = mass.times(1.485114e-30)
                let life = ((mass.div(1.989e30)).pow(3).times(1.16e67).div(235529.9))
                let a = "Your real Black Hole mass is <h2>"+formatMass(mass)+"</h2>.<br>It's Schwardschild radius is <h2>"+formatSize(sr)+"</h2> (starts on <h3 style = color:#222222;>1e21 Black Hole mass</h3>).<br>Time needed to it's evaporation due Hawking radiation is <h2>"+formatTimeLong1(life)+"</h2> (starts on <h3 style = color:#222222;>1e24 Black Hole mass</h3>)<br><br>"
                return a
                }
            }],
            ],
        },
    },
    branches: [["p","#919191"]],
    hotkeys: [
        {key: "b", description: "B: Reset for Black Hole mass", onPress(){if ((canReset(this.layer))&&((inChallenge("sp", 21)))) doReset(this.layer)}},
    ],
    layerShown(){return ((inChallenge("sp", 21))||hasChallenge("sp",21))},
		passiveGeneration() { return (hasChallenge("sp",21))?0.25:0 },
})
addLayer("null", {
    name: "Blank", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "nul", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new Decimal(0),
    }},
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Existence Essence", // Name of prestige currency
    baseResource: "Existence Shard", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.25, // Prestige currency exponent
    layerShown(){return false},
})

addLayer("ac", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    unlocked() {return true},
    color: "#af9f34",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    tooltip() {return "Achievements"},
    layerShown(){return true},
    achievements: {
        rows: 5,
        cols: 6,
      11: {
        name: "Start of Everything!",
        done() { return player.p.points.gte(1) },
        tooltip: "Perform a Primordial Essence reset.",
				image: "images/achs/11.png",
            },
			12: {
				name: "Shard Conjugation",
				done() { return player.points.gte(25000) },
				tooltip: "Reach 25000 Existence Shards.",
				image: "images/achs/12.png",
			},
			13: {
				name: "Strong Existence",
				done() { return player.p.upgrades.length>=5 },
				tooltip: "Purchase 5 Primordial Essence upgrades.",
				image: "images/achs/13.png",
			},
			14: {
				name: "Pre-Aether State",
				done() { return (player.p.points.gte(15)&&(player.points.gte(1e12))) },
				tooltip: "Reach 1e12 ES and 15 PE.",
				image: "images/achs/14.png",
			},
			15: {
				name: "Either the Space and Time",
				done() { return (player.sp.unlocked||(player.t.unlocked)) },
				tooltip: "Unlock either the Space or Time layers.",
				image: "images/achs/15.png",
			},
			16: {
				name: "Aetherize",
				done() { return player.a.unlocked },
				tooltip: "Unlock the Aether layer.",
				image: "images/achs/15.png",
			},
      21: {
        name: "Space-Time is formed!",
        done() { return (player.sp.unlocked&&(player.t.unlocked)) },
        tooltip: "Unlock both the Space and Time layers.",
				image: "images/achs/11.png",
            },
			22: {
				name: "That's Easy!",
				done() { return (hasChallenge("sp",11)) },
				tooltip: "Complete the Existence Weakening challenge.",
				image: "images/achs/12.png",
			},
			23: {
				name: "This is Not Easy...",
				done() { return (hasChallenge("sp",12)&&(hasChallenge("sp",13))) },
				tooltip: "Complete the Anti-Shard Supremacy and Shattered Existence challenges.",
				image: "images/achs/13.png",
			},
			24: {
				name: "The Pain is Gone... I hope so...",
				done() { return player.sp.challenges.length>=4 },
				tooltip: "Complete all Space challenges.",
				image: "images/achs/14.png",
			},
			25: {
				name: "Black Hole MUST be nerfed!",
				done() { return player.bh.points.gte(1e12) },
				tooltip: "Reach 1e12 Black Hole masses.",
				image: "images/achs/15.png",
			},
			26: {
				name: "Reached the End...",
				done() { return player.points.gte(getPointCap()) },
				tooltip: "Get your Existence Shard to be <h3 style=opacity:0.5>(hardcapped)</h3>.",
				image: "images/achs/15.png",
			},
      31: {
        name: "A Far Interaction...",
        done() { return player.a.upgrades.length>=1 },
        tooltip: "Reduce the distance between Shards for once.",
				image: "images/achs/11.png",
            },
			32: {
				name: "A Bit Closer...",
				done() { return tmp.a.getShDistRatio>=10 },
				tooltip: "Reduce the distance to 9.3e9 light-years.",
				image: "images/achs/12.png",
			},
		  33: {
				name: "Between Milky Ways...",
				done() { return tmp.a.getShDistRatio>=1e6},			
        tooltip: "Reduce the distance to 9.3e7 light-years.",
				image: "images/achs/13.png",
			},
			34: {
				name: "Are You <h3 style=opacity:0.5>Reading</h3> His Book?",
				done() { return tmp.a.getShDistRatio>=6.2e9 },
				tooltip: "Reduce the distance to 15 light-years.",
				image: "images/achs/14.png",
			},
			35: {
				name: "ARE YA FU**ING SERIIOUS!?",
				done() { return player.points.gte(1e20) },
				tooltip: "???",
				image: "images/achs/15.png",
			},
			36: {
				name: "Aetherize Aether",
				done() { return player.a.points.gte(100) },
				tooltip: "Unlock the ???.",
				image: "images/achs/15.png",
			},
    },
})
addLayer("stat", {
    name: "Stats", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    unlocked() {return true},
    color: "#666666",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    tooltip() {return "Statistics"},
    layerShown(){return true},
   tabFormat: {
        "Main": {
        content:[
            "blank",
        ["raw-html", 
            function () {
                if (player.tab == "stat") {
                let time13 = ((player.null.points.add(5000)).sub(player.points)).div(getPointGen())
                let time13c = (player.points.sub(5000).div(getPointGen()))
                let time21 = ((player.null.points.add(100)).sub(player.points)).div(getPointGen())
                let time21c = (player.points.sub(100).div(getPointGen()))
                let a = "You have <h2 style='color:#ffccff; text-shadow: #ffccff 0px 0px 10px;'>"+ formatWhole(player.points) +" ("+formatWhole(getPointGen())+"/s)</h2> Existence Shards.<br>"
                let b = "You have <h2 style = 'color:#ffffff; text-shadow: #ffffff 0px 0px 10px;'>"+formatWhole(player.p.points)+"</h2> Primordial Essences.<br>"
                let c = player.sp.unlocked?"You have <h2 style = 'color:#bb00ff; text-shadow: #bb00ff 0px 0px 10px;'>"+formatWhole(player.sp.points)+"</h2> Spaces.<br>":""
                let d = player.t.unlocked?"You have <h2 style = 'color:#0066ff; text-shadow: #0066ff 0px 0px 10px;'>"+formatWhole(player.t.points)+"</h2> Times.<br>":""
                let e = player.a.unlocked?"You have <h2 style = 'color:#bb00bb; text-shadow: #bb00bb 0px 0px 10px;'>"+formatWhole(player.a.points)+"</h2> Aethers.<br>":""
                let f = player.ee.unlocked&&(inChallenge("sp",13)||inChallenge("sp",21))?"You have <h2 style = color:#bbbbbb;>"+formatWhole(player.ee.points)+" ("+formatWhole((player.points.pow(1.25).times(tmp.ee.passiveGeneration)))+"/s)</h2> Existence Essences.<br>":""
                let g = player.bh.unlocked&&(inChallenge("sp",13)||inChallenge("sp",21)||hasChallenge("sp",21))?"You have <h2 style='color: #222222; text-shadow: #222222 0px 0px 10px;'>"+formatWhole(player.bh.points)+"</h2> Black hole masses.<br>":""
                let h = player.f.unlocked?"You have <h2 style = color:#f56d53;>"+formatWhole(player.t.points)+"</h2> Forces.<br>":""
                let i = player.s.unlocked?"You have <h2 style = color:#4bfc90;>"+formatWhole(player.s.points)+"</h2> Souls.<br><br>":""
                let inf = player.inf.unlocked?"You have <h2 style = color:#4bfc90;>"+formatWhole(player.inf.points)+"</h2> Infinity Shards and <h2 style = color:#4bfc90;>"+formatWhole(player.inf.infpow)+"</h2> Infinity Power.<br><br>":""
                let sp13 = inChallenge("sp",13)?"<h3>Shattered Existence</h3> progress <h2 style = color:#6ae67e;>"+format((player.points.div(5000)).times(100).min(100))+"%</h2>.<br>":""
                let sp13t = inChallenge("sp",13)&&!player.points.gte(5000)?"If your Existence Shard gain remains constant, the challenge goal will be reached in <h2 style = color:#ff0000;>"+formatTime(time13)+"</h2><br>":""
                let sp13c = inChallenge("sp",13)&&player.points.gte(5000)?"Challenge goal was reached <h2 style = color:#6ae67e;>"+formatTime(time13c)+"</h2> ago<br>":""
                let sp21 = inChallenge("sp",21)?"<h3>Existenceless</h3> progress <h2 style = color:#6ae67e;>"+format((player.points.div(100)).times(100).min(100))+"%</h2>.<br>":""
                let sp21t = inChallenge("sp",21)&&!player.points.gte(100)?"If your Existence Shard gain remains constant, the challenge goal will be reached in <h2 style = color:#ff0000;>"+formatTime(time21)+"</h2><br>":""
                let sp21c = inChallenge("sp",21)&&player.points.gte(100)?"Challenge goal was reached <h2 style = color:#6ae67e;>"+formatTime(time21c)+"</h2> ago<br>":""
                let t = (player.null.points.add(1.78e308).div(getPointGen().add(1)))
                let inft = "If Existence Shard gain remains constant, then you can reach Infinity in "+formatTime(t)+""
                return a+b+c+d+e+f+g+h+i+inf+sp13+sp13t+sp13c+sp21+sp21t+sp21c+inft
                }
            }],
            "blank",
            "blank",
          ["bar","rti"],
          ["bar","rte"],
            ]
        },
        "Shards Representation": { // From AD NG+++
            content:[
            "blank",
            ["raw-html", 
            function () {
                if (player.tab == "stat") { 
                let x = player.points
                let a = "You have <h2 style='color:#ffccff; text-shadow: #ffccff 0px 0px 10px;'>"+format(x)+"</h2> Existence Shards.<br><br>"
                let p = 6.187e34**3*1e-21
                let digits = x.log10().floor().add(1).div(3)
                let years = digits.div(31556952)
                let unis = years.div(13.78e9) 
                let size = formatSize(Decimal.div(1e-21,x.min(p)).root(3))
                let b = "If every shard were the size of pre-Existence Particle, and pre-Existence Particle is "+size+" in diameter, you would have enough to create a micro-universe that is entirely made up of pre-Blueprint Particle."
                if (years.gte(1e40)) b = "The time needed to finish writing your full cases amount at a rate of 3 digits per second would span " + formatTimeLong1(digits)+"."
                else if (years.gte(1e9)) {
                    b = "The time needed to finish writing your full shards amount at a rate of 3 digits per second would span "
                    if (unis.lt(1)) b+= format(unis.mul(100)) + "% of the age of the universe."
                    else b+= format(unis) + " times the age of the universe."
                }
                else if (years.gte(2022)) b = "If you wanted to finish writing out your cases amount at a rate of 3 digits per second, you would need to start it in " + eventsTime(years)
                else if (x.gte(Decimal.pow(10,750739887.08))) {b = "If you wrote 3 digits of your shards amount every second since you were born, you would "
                    if (years.gte(79.3)) b += "be a ghost for " + format(years.sub(79.3).div(years).mul(100)) + "% of the session."
	                else b += "waste " + format(years.div(0.793)) + "% of your projected average lifespan."
                }
                else if (x.gte("ee5")) b = "If you wrote 3 digits per second, it would take "+formatTime(digits)+" to write down your shards."
                else if (x.gte(p)) b = "If every exstence shard were the size of pre-Existence Particle, and pre-Existence Particle is 1 Planck Length in diameter, you would have enough to make "+formatComp(x.mul(2.2108845e-105))
                return a+b
                }
            }],
            ],
        },
                "Spelling": {
                        content: [
                                ["display-text", function(){
                                        let corr = numCorrectLetters(player.targetWord)
                                        let wordUpper = player.targetWord.toLocaleUpperCase()
                                        let start = "<bdi style='font-size: 300%'>"
                                        let goodPart = "<bdi style='color:#FF0000'>" + wordUpper.slice(0,corr) + "</bdi>"
                                        let badPart  = "<bdi style='color:#993333'>" + wordUpper.slice(corr) + "</bdi>"
                                        return start + goodPart + badPart + "</bdi>"
                                }],
                                ["display-text", function(){
                                        let a = "You have spelled " + formatWhole(player.wordsSpelled)
                                        let b = " words correctly!"
                                        let c = "<br><br><br><br><br><br>"
                                        let d = "<br>Press space to get a new word.<br>This is just a minigame, so you can safely ignore it :)"
                                        return c + c + a + b + d
                                }],
                        ],
                        unlocked(){
                                return true
                        }
                },
        },
    bars: {
        rti: {
            direction: RIGHT,
            width: 650,
            height: 75,
            progress() { return Math.log10(player.points)/Math.log10(1.78e308) },
            display() { return "<h4 style = 'color:#b67f33; text-shadow: #000000 0px 0px 10px;'>Road to Infinity</h4><br>Completed: "+ format((Math.log10(player.points)/Math.log10(1.78e308))*100) +"%" },
            fillStyle(){return {'background-color':"#b67f33"}},
            instant: true,
            unlocked() {return !player.inf.unlocked},
        },
        rte: {
            direction: RIGHT,
            width: 650,
            height: 75,
            progress() { return Math.log10(player.inf.points)/Math.log10(1.78e308) },
            display() { return "<h4 style = 'color:#a230d0; text-shadow: #000000 0px 0px 10px;'>Road to Eternity</h4><br>Completed: "+ format((Math.log10(player.inf.points+1)/Math.log10(1.78e308))*100) +"%" },
            fillStyle(){return {'background-color':"#b341e0"}},
            instant: true,
            unlocked() {return player.inf.unlocked},
        },
    },
})
addLayer("sc", {
    name: "Stats", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    unlocked() {return true},
    color: "#ddff66",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    tooltip() {return "Caps"},
    layerShown(){return true},
   tabFormat: {
        "Softcaps": {
        content:[
            "blank",
        ["raw-html", 
            function () {
                if (player.tab == "sc") {
                let x1 = player.points
                let a = ""
                let a1 = ""
                if (x1.gte(1e15)) a = "<h1 style = color:#ffccff;>Existence Shard</h1><br> <h3>#1. Starts at</h3> <h2 style = color:#ffccff;>1e15</h2><h3>, gain square rooted</h3><br><br>"
                if (x1.gte(1e30)) a = "<h1 style = color:#ffccff;>Existence Shard</h1><br> <h3>#2. Starts at</h3> <h2 style = color:#ffccff;>1e30</h2><h3>, gain cube rooted</h3><br><br>"
                if (x1.gte(1e45)) a = "<h1 style = color:#ffccff;>Existence Shard</h1><br> <h3>#3. Starts at</h3> <h2 style = color:#ffccff;>1e45</h2><h3>, gain tesseract rooted (4th root)</h3><br><br>"
                if (hasUpgrade('t',14)) a1 = "<h3>Current hardcap is: </h3><h2 style = color:#ffccff;>"+format(getPointCap())+"</h2>"
                return a+a1
                }
            }],
            ]
        },
        },
})
addLayer("inf", {
    name: "Infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "∞", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
        //Infinity Dims
        infpow: new Decimal(0),
        dim1: new Decimal(0),
        dim2: new Decimal(0),
        dim3: new Decimal(0),
        dim4: new Decimal(0),
    }},
    color: "#b67f33",
    prestigeButtonText() { 
        return "Infinitize Shards for <b>+" + formatWhole(tmp[this.layer].resetGain) + "</b> Infinity Shards" +
         (Decimal.gte(tmp[this.layer].resetGain, 1000) ? "" : "<br/>Next at " + formatWhole(tmp[this.layer].nextAt) + " Existence Shards")
    },
    requires() { return new Decimal(1.78e308)}, // Can be a function that takes requirement increases into account
    resource: "Infinity Shards⧜", // Name of prestige currency
    baseResource: "Existence Shards", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0085, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    getIDimBoost() {
        return new Decimal(1)
    },
    update(diff) {
        if (player.inf.buyables[11]) player.inf.infpow = player.inf.infpow.add((tmp.inf.buyables[11].effect).times(diff));
        if (player.inf.buyables[12]) player.inf.buyables[11] = player.inf.buyables[11].add((tmp.inf.buyables[12].effect).times(diff));
        if (player.inf.buyables[13]) player.inf.buyables[12] = player.inf.buyables[12].add((tmp.inf.buyables[13].effect).times(diff));
        if (player.inf.buyables[14]) player.inf.buyables[13] = player.inf.buyables[13].add((tmp.inf.buyables[14].effect).times(diff));
        if (player.eter.buyables[11]) player.inf.buyables[14] = player.inf.buyables[14].add((player.eter.eterpow).times(diff));
    },
    buyables: {
    11: {
			title: "Infinity Dimension I",
        cost() { 
                let x = player.inf.dim1
                let cost = Decimal.pow(10, x)
                return cost
               },
            base() { 
                return new Decimal(10)
            },
            total() {
                let total = getBuyableAmount("inf", 11)
                return total
            },
            bought() {
                let bought = player.inf.dim1
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = player.inf.dim1
                let base = tmp.inf.buyables[11].base
                return (Decimal.pow(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "which will generate "+format(this.effect())+" Infinity Power per second.\n\
                Cost: " + format(tmp.inf.buyables[11].cost)+" Infinity Shards\n\
                Effect: " + format(tmp.inf.buyables[11].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("inf", 11))
            },
            unlocked() { return player.inf.unlocked }, 
            canAfford() {
                    return player.inf.points.gte(tmp.inf.buyables[11].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.inf.dim1 = player.inf.dim1.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
        },
    12: {
			title: "Infinity Dimension II",
        cost() { 
                let x = player.inf.dim2
                let cost = Decimal.pow(1e2, x)
                return cost
               },
            base() { 
                return new Decimal(10)
            },
            total() {
                let total = getBuyableAmount("inf", 12)
                return total
            },
            bought() {
                let bought = player.inf.dim2
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = player.inf.dim2
                let base = tmp.inf.buyables[12].base
                return (Decimal.pow(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "which will generate "+format(this.effect())+" Infinity Dimension I per second.\n\
                Cost: " + format(tmp.inf.buyables[12].cost)+" Infinity Shards\n\
                Effect: " + format(tmp.inf.buyables[12].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("inf", 12))
            },
            unlocked() { return player.inf.unlocked }, 
            canAfford() {
                    return player.inf.points.gte(tmp.inf.buyables[12].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.inf.dim2 = player.inf.dim2.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
         },
    13: {
			title: "Infinity Dimension III",
        cost() { 
                let x = player.inf.dim3
                let cost = Decimal.pow(1e3, x)
                return cost
               },
            base() { 
                return new Decimal(10)
            },
            total() {
                let total = getBuyableAmount("inf", 13)
                return total
            },
            bought() {
                let bought = player.inf.dim3
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = player.inf.dim3
                let base = tmp.inf.buyables[13].base
                return (Decimal.pow(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "which will generate "+format(this.effect())+" Infinity Dimension II per second.\n\
                Cost: " + format(tmp.inf.buyables[13].cost)+" Infinity Shards\n\
                Effect: " + format(tmp.inf.buyables[13].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("inf", 13))
            },
            unlocked() { return player.inf.unlocked }, 
            canAfford() {
                    return player.inf.points.gte(tmp.inf.buyables[13].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.inf.dim3 = player.inf.dim3.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
        },
    14: {
			title: "Infinity Dimension IV",
        cost() { 
                let x = player.inf.dim4
                let cost = Decimal.pow(1e4, x)
                return cost
               },
            base() { 
                return new Decimal(10)
            },
            total() {
                let total = getBuyableAmount("inf", 11)
                return total
            },
            bought() {
                let bought = player.inf.dim4
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = player.inf.dim4
                let base = tmp.inf.buyables[14].base
                return (Decimal.pow(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "which will generate "+format(this.effect())+" Infinity Dimension III per second.\n\
                Cost: " + format(tmp.inf.buyables[14].cost)+" Infinity Shards\n\
                Effect: " + format(tmp.inf.buyables[14].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("inf", 14))
            },
            unlocked() { return player.inf.unlocked }, 
            canAfford() {
                    return player.inf.points.gte(tmp.inf.buyables[14].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.inf.dim4 = player.inf.dim4.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
        },
  },
    row: 7, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return (player.points.gte(1e277)||player.inf.unlocked)},
   
})
addLayer("eter", {
    name: "Force", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "𝛙", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new Decimal(0),
		  	best: new Decimal(0),
		  	total: new Decimal(0),
        time: new Decimal(0),
        //Infinity Dims
        eterpow: new Decimal(0),
        dim1: new Decimal(0),
        dim2: new Decimal(0),
        dim3: new Decimal(0),
        dim4: new Decimal(0),
    }},
    color: "#b341e0",
    prestigeButtonText() { 
        return "Eternalize Shards for <b>+" + formatWhole(tmp[this.layer].resetGain) + "</b> Eternity Shards" +
         (Decimal.gte(tmp[this.layer].resetGain, 1000) ? "" : "<br/>Next at " + formatWhole(tmp[this.layer].nextAt) + " Infinity Shards")
    },
    requires() { return new Decimal(1.78e308)}, // Can be a function that takes requirement increases into account
    resource: "Eternity Shards", // Name of prestige currency
    baseResource: "Infinity Shards", // Name of resource prestige is based on
    baseAmount() {return player.inf.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0085, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(diff) {
        if (player.eter.buyables[11]) player.eter.eterpow = player.eter.eterpow.add((tmp.eter.buyables[11].effect).times(diff));
    },
    buyables: {
    11: {
			title: "Eternity Dimension I",
        cost() { 
                let x = player.eter.dim1
                let cost = Decimal.pow(10, x)
                return cost
               },
            base() { 
                return new Decimal(1)
            },
            total() {
                let total = getBuyableAmount("eter", 11)
                return total
            },
            bought() {
                let bought = player.eter.dim1
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = player.eter.dim1
                let base = tmp.eter.buyables[11].base
                return (Decimal.times(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.eter.buyables[11].cost)+" Eternity Shards\n\
                Effect: " + format(tmp.eter.buyables[11].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("eter", 11))
            },
            unlocked() { return player.eter.unlocked }, 
            canAfford() {
                    return player.eter.points.gte(tmp.eter.buyables[11].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.eter.dim1 = player.eter.dim1.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
        },
    12: {
			title: "Eternity Dimension II",
        cost() { 
                let x = player.eter.dim2
                let cost = Decimal.pow(1e2, x)
                return cost
               },
            base() { 
                return new Decimal(1)
            },
            total() {
                let total = getBuyableAmount("eter", 12)
                return total
            },
            bought() {
                let bought = player.eter.dim2
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.eter.buyables[12].total
                let base = tmp.eter.buyables[12].base
                return (Decimal.times(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.eter.buyables[12].cost)+" Eternity Shards\n\
                Effect: " + format(tmp.eter.buyables[12].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("eter", 12))
            },
            unlocked() { return player.eter.unlocked }, 
            canAfford() {
                    return player.eter.points.gte(tmp.eter.buyables[12].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.eter.dim2 = player.eter.dim2.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
         },
    13: {
			title: "Eternity Dimension III",
        cost() { 
                let x = player.eter.dim3
                let cost = Decimal.pow(1e3, x)
                return cost
               },
            base() { 
                return new Decimal(1)
            },
            total() {
                let total = getBuyableAmount("eter", 13)
                return total
            },
            bought() {
                let bought = player.eter.dim3
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.eter.buyables[13].total
                let base = tmp.eter.buyables[13].base
                return (Decimal.times(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.eter.buyables[13].cost)+" Eternity Shards\n\
                Effect: " + format(tmp.eter.buyables[13].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("eter", 13))
            },
            unlocked() { return player.eter.unlocked }, 
            canAfford() {
                    return player.eter.points.gte(tmp.eter.buyables[13].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.eter.dim3 = player.eter.dim3.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
        },
    14: {
			title: "Eternity Dimension IV",
        cost() { 
                let x = player.eter.dim4
                let cost = Decimal.pow(1e4, x)
                return cost
               },
            base() { 
                return new Decimal(1)
            },
            total() {
                let total = getBuyableAmount("eter", 11)
                return total
            },
            bought() {
                let bought = player.eter.dim4
                return bought
            },
			      effect() { // Effects of owning x of the items, x is a decimal
                let x = tmp.eter.buyables[14].total
                let base = tmp.eter.buyables[14].base
                return (Decimal.times(base,x));
            },
			      display() { // Everything else displayed in the buyable button after the title
                return "Reduce the distance between shards by "+format(this.base())+".\n\
                Cost: " + format(tmp.eter.buyables[14].cost)+" Eternity Shards\n\
                Effect: " + format(tmp.eter.buyables[14].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("eter", 14))
            },
            unlocked() { return player.eter.unlocked }, 
            canAfford() {
                    return player.eter.points.gte(tmp.eter.buyables[14].cost)},
            buy() { 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                player.eter.dim4 = player.eter.dim4.add(1).max(1)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
            },
        },
  },
    row: 8, // Row the layer is in on the tree (0 is the first row)
    branches: [["inf","#b341e0"]],
    layerShown(){return (player.inf.points.gte(1e176)||player.eter.unlocked)},
})
