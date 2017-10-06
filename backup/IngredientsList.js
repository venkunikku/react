import Ingredient from './Ingredient'

const IngredientsList = ({list}) => (
	<ul className="ingredients">
	{
		list.map((ing,i)=> <Ingredient key={i} {...ing} />)
	}
	</ul>

)

export default IngredientsList