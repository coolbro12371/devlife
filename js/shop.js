var Shop = {  }

Shop.items = {
	'coffee': {
		'showing': false,
		'oneuse': false,
		'initial': true,
		'label': 'Buy coffee',
		'help': 'Have a coffee and temporarily increase your money rate',
		'cost': 5,
		'buy': function(button, secondsLeft){
			Stats.coffeeIncrement = Core.base.moneyIncPerPulse * Core.base.coffeeInc
			Core.base.moneyIncPerPulse += Stats.coffeeIncrement
			Stats.isCoffeePowered = true
			Core.updateHUD()
			Stats.coffeesBought++
			button.setAttribute('disabled', true)
			button.setAttribute('data-running', 'true')
			Stats.coffeeTimeLeft = secondsLeft || Core.base.coffeeEffectTime
			button.innerText = button.textContent = 'Coffee time left: ' + Core.timeFormat(Stats.coffeeTimeLeft * 1000)
			window.coffeeInterval = setInterval(function(){
				if(Stats.coffeeTimeLeft <= 0){
					Core.base.moneyIncPerPulse -= Stats.coffeeIncrement
					Stats.coffeeIncrement = 0
					Stats.isCoffeePowered = false
					button.innerText = button.textContent = 'Buy Coffee (' + Core.numberFormat(Core.base.coffeePrice) + ')'
					button.removeAttribute('disabled')
					button.removeAttribute('data-running')
					clearInterval(window.coffeeInterval)
					delete Stats.coffeeTimeLeft
					Core.updateHUD()
				}else{
					button.innerText = button.textContent = 'Coffee time left: ' + Core.timeFormat(Stats.coffeeTimeLeft * 1000)
					Stats.coffeeTimeLeft--
				}
			}, 1000)
		}
	},
	'energyDrink': {
		'showing': false,
		'oneuse': false,
		'initial': true,
		'label': 'Buy energy drink',
		'help': 'Have an energy drink to boost your pulse speed',
		'cost': 15,
		'buy': function(button, secondsLeft){
			Core.base.pulseDuration *= Core.base.energyDrinkInc
			Stats.isEnergyDrinkPowered = true
			Core.updateHUD()
			Stats.energyDrinksBought++
			button.setAttribute('disabled', true)
			button.setAttribute('data-running', 'true')
			Stats.energyDrinkTimeLeft = secondsLeft || Core.base.energyDrinkEffectTime
			button.innerText = button.textContent = 'Energy Drink time left: ' + Core.timeFormat(Stats.energyDrinkTimeLeft * 1000)
			window.energyDrinkInterval = setInterval(function(){
				if(Stats.energyDrinkTimeLeft <= 0){
					Core.base.pulseDuration /= Core.base.energyDrinkInc
					Stats.isEnergyDrinkPowered = false
					button.innerText = button.textContent = 'Buy Energy Drink (' + Core.numberFormat(Core.base.energyDrinkPrice) + ')'
					button.removeAttribute('disabled')
					button.removeAttribute('data-running')
					clearInterval(window.energyDrinkInterval)
					delete Stats.energyDrinkTimeLeft
					Core.updateHUD()
				}else{
					button.innerText = button.textContent = 'Energy Drink time left: ' + Core.timeFormat(Stats.energyDrinkTimeLeft * 1000)
					Stats.energyDrinkTimeLeft--
				}
			}, 1000)
		}
	},
	'mechanicalKeyboard': {
		'showing': false,
		'oneuse': true,
		'initial': false,
		'label': 'Mechanical Keyboard',
		'help': 'Buy a better keyboard to increase the money you make with the command prompt',
		'cost': 1000,
		'buy': function(){
			Core.base.commandPromptInc *= 2
			Core.addToShowcase({
				'title': 'Brand new mechanical keyboard (Command prompt key value x2)',
				'text': '⌨️'
			})
		}
	},
	'infiniteCoffeeContract': {
		'showing': false,
		'oneuse': true,
		'initial': true,
		'label': 'Infinite coffee contract',
		'help': 'You make a contract with a coffee vendor to have coffee with no cost and permanently',
		'cost': 20000,
		'buy': function(){
			if(Stats.isCoffeePowered){
				clearInterval(window.coffeeInterval)
				delete Stats.coffeeTimeLeft
			}else{
				Core.base.moneyIncPerPulse += Core.base.moneyIncPerPulse * Core.base.coffeeInc
				Stats.isCoffeePowered = true
			}
			// Achievement Caffeine addict
			if(Stats.coffeesBought < 500){
				Stats.coffeesBought = 500
			}
			Core._('#shop-item-coffee').parentNode.removeChild(Core._('#shop-item-coffee'))
			Core.addToShowcase({
				'title': 'Infinite Coffee contract (Permanent coffee boosted)',
				'text': '☕️'
			})
		}
	},
	'companyNameChange': {
		'showing': false,
		'oneuse': false,
		'initial': false,
		'label': 'Company name change',
		'help': '',
		'cost': 5000,
		'buy': function(){
			var oldName = Stats.companyName
			Stats.companyName = prompt('Write the new name of your company') || Stats.companyName
			// Si no cambia el nombre o cancela se le devuelve el dinero
			if(Stats.companyName === oldName){
				Stats.money += this.cost
				return false
			}
			Core.showPopUp({
				'title': 'Company name changed',
				'description': 'Your company name is now "' + Stats.companyName + '"'
			})
			document.title = Stats.companyName + ' intranet | devLife'
			Core._('.navbar .brand').innerText = Core._('.navbar .brand').textContent = Stats.companyName + ' intranet'
		}
	},
	'marketingCampaign': {
		'showing': false,
		'oneuse': false,
		'initial': true,
		'label': 'Marketing campaign',
		'help': 'Launch a marketing campaign to increase opportunities for quick projects',
		'cost': 2000,
		'buy': function(button, secondsLeft){
			var _item = this
			Core.base.quickProjectsFinderTimeMagnifier = false
			Projects.quickProjectFinder()
			Stats.marketingCampaignRunning = true
			Stats.marketingCampaignTimeLeft = secondsLeft || 300 // 5m
			button.setAttribute('disabled', true)
			button.setAttribute('data-running', 'true')
			button.innerText = button.textContent = 'Marketing campaign time left: ' + Core.timeFormat(Stats.marketingCampaignTimeLeft * 1000)
			window.marketingCampaignInterval = setInterval(function(){
				if(Stats.marketingCampaignTimeLeft <= 0){
					Core.base.quickProjectsFinderTimeMagnifier = true
					button.innerText = button.textContent = _item.label + ' (' + Core.numberFormat(_item.cost) + ')'
					button.removeAttribute('disabled')
					button.removeAttribute('data-running')
					clearInterval(window.marketingCampaignInterval)
					delete Stats.marketingCampaignTimeLeft
				}else{
					Stats.marketingCampaignTimeLeft--
					button.innerText = button.textContent = 'Marketing campaign time left: ' + Core.timeFormat(Stats.marketingCampaignTimeLeft * 1000)
				}
			}, 1000)
		}
	},
	'virtualPersonalAssistant': {
		'showing': false,
		'oneuse': true,
		'initial': false,
		'label': 'Y.A.A.',
		'help': '"Your Awesome Assistant" will help you in your everyday tasks so you can take more time for your projects',
		'cost': 10000,
		'buy': function(button){
			Core.base.projectTimeReductionPercent += 1
			this.owned = true
			Core.addToShowcase({
				'title': 'Y.A.A. (Your Awesome Assistant) "What do you need?" (Project times reduction: 1%)',
				'text': '🖲'
			})
		},
	},
	'devmx300': {
		'showing': false,
		'oneuse': true,
		'initial': false,
		'label': 'PC Dev-MX300',
		'help': 'A brand new PC in case you need more power!',
		'cost': 15000,
		'buy': function(){
			this.owned = true
			Stats.computerModel = 'Dev-MX300'
			Stats.computerVersion = 1
			Core.base.computerMultiplierCost = 612
			Core.base.maxComputerVersion = 10
			Core.base.commandPromptInc *= 2
			Core.base.projectTimeReductionPercent += 3
			Core.base.nextComputerVersionCost = improvements.upgradeComputer.cost = Core.base.computerMultiplierCost * (Stats.computerVersion + 1)
			var realPulse = Core.base.pulseDuration
			if(Stats.isEnergyDrinkPowered){
				realPulse /= Core.base.energyDrinkInc
			}
			Core.base.pulseDuration -= realPulse * 0.30
			Core.showImprovementButton('upgradeComputer')
			Core.showImprovementButton('addProject')
			Core._('#css').setAttribute('href', 'css/intranet.css?' + new Date().getTime())
		}
	},
	'dev550sx': {
		'showing': false,
		'oneuse': true,
		'initial': false,
		'label': 'PC Dev-550sx PRO',
		'help': '',
		'cost': 45000,
		'buy': function(){
			this.owned = true
			Stats.computerModel = 'Dev-550sx PRO'
			Stats.computerVersion = 1
			Core.base.computerMultiplierCost = 961
			Core.base.maxComputerVersion = 20
			Core.base.commandPromptInc *= 2
			Core.base.projectTimeReductionPercent += 3
			Core.base.nextComputerVersionCost = improvements.upgradeComputer.cost = Core.base.computerMultiplierCost * (Stats.computerVersion + 1)
			var realPulse = Core.base.pulseDuration
			if(Stats.isEnergyDrinkPowered){
				realPulse /= Core.base.energyDrinkInc
			}
			Core.base.pulseDuration -= realPulse * 0.40
			Core.showImprovementButton('upgradeComputer')
			Core.showImprovementButton('addProject')
			Core._('#css').setAttribute('href', 'css/intranet2.css?' + new Date().getTime())
		}
	},
	'imRichDiamondPlate': {
		'showing': false,
		'oneuse': true,
		'initial': true,
		'label': '"I\'m a rich b**ch" diamond plate',
		'help': 'Show them you are SO RICH! at least before buying this useless plate',
		'cost': 100000000,
		'buy': function(){
			this.owned = true
			Core.addToShowcase({
				'title': '"I\'m a rich b**ch" diamond plate (Useless)',
				'text': '💎'
			})
		}
	}
}

Shop.showItemButton = function(itemID){
	if(!Shop.items[itemID]) return false
	var item = Shop.items[itemID]
	var button = document.createElement('BUTTON')
	button.innerText = button.textContent = button.textContent = item.label + ' (' + Core.numberFormat(item.cost) + ')'
	button.className = 'shopItem'
	button.setAttribute('id', 'shop-item-' + itemID)
	button.setAttribute('data-cost', item.cost)
	if(Stats.money < item.cost){
		button.setAttribute('disabled', true)
	}
	if(item.help){
		button.className += ' help'
		button.setAttribute('data-title', item.help)
	}
	button.onclick = function(e){
		e.preventDefault()
		if(Stats.money < item.cost){
			this.setAttribute('disabled', true)
			return false
		}
		Stats.money -= item.cost
		item.buy(this)
		if(item.oneuse){
			this.parentNode.removeChild(this)
			item.showing = false
		}
		Core.updateHUD()
	}
	Core._('#shop').appendChild(button)
	item.showing = true
	Core.updateHUD()
}
