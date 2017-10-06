import IngredientsList from './IngredientsList'
import Instructions from './Instructions'

const Recipe = ({name, ingredients, steps}) => (
	<section id={name.toLowerCase().relace(/ /g,'-')}>
		<IngredientsList list={ingredients} />
		<Instructions title="Cooking Instructions" steps={steps} />
	
	</section>

)

export default Recipe