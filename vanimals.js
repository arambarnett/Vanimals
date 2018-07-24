const weighted = require('weighted');
const options = [
	{
		weight: 0.1,
		payload: {
			name: 'Teri',
			image_url: '/static/images/jona-dinges-tiger.jpg',
			short_description: 'The Sumatron Tiger',
			population: '500',
			status: 'Critically Endangered',
			distribution: '1 in ten thousand',
			description:
				'The Sumatran Elephant is a rare subspecies of elephant that lives in the Indonesian Island, Sumatra. The elephant has lost much of its original habitat because of massive human-hunting',
			location: 'The Sumatran Elephant inhabits the south east asian country of',
			rarity:
				'Out of a total population of 5 million Vanimals, Elephants make up 1% Out of the 500 elephants discovered, 12% of them have Magenta Out of 60 Elephants with Magneta, 3 are 75% Magneta',
		},
		attributes: ['Green']
	},
	{
		weight: 0.5,
		payload: {
			name: 'Georgio',
			image_url: '/static/images/oleg-stebenyev-r4-gorilla-f.jpg',
			short_description: 'The Cross River Gorilla',
			population: '500',
			status: 'Critically Endangered',
			distribution: '1 in ten thousand',
			description:
				'The Sumatran Elephant is a rare subspecies of elephant that lives in the Indonesian Island, Sumatra. The elephant has lost much of its original habitat because of massive human-hunting',
			location: 'The Sumatran Elephant inhabits the south east asian country of',
			rarity:
				'Out of a total population of 5 million Vanimals, Elephants make up 1% Out of the 500 elephants discovered, 12% of them have Magenta Out of 60 Elephants with Magneta, 3 are 75% Magneta'
		},
		attributes: ['Gold']
	},
	{
		weight: 0.4,
		payload: {
			name: 'Dewi',
			image_url: '/static/images/elephant.jpg',
			short_description: 'Dwei the Elepaht',
			population: '500',
			status: 'Critically Endangered',
			distribution: '1 in ten thousand',
			description:
				'The Sumatran Elephant is a rare subspecies of elephant that lives in the Indonesian Island, Sumatra. The elephant has lost much of its original habitat because of massive human-hunting',
			location: 'The Sumatran Elephant inhabits the south east asian country of',
			rarity:
				'Out of a total population of 5 million Vanimals, Elephants make up 1% Out of the 500 elephants discovered, 12% of them have Magenta Out of 60 Elephants with Magneta, 3 are 75% Magneta'
		},
		attributes: ['Purple']
	}
];

function select() {
	const weights = options.map(each => each.weight);
	return weighted.select(options, weights);
}

module.exports = {
	options,
	select
};
