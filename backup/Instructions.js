const Instructions = ({title,steps}) =>(
	<section className="instructions">
		<h1>{title}</h1>
			{
				steps.map((s,i)=> 
							<p key={i}>{s}</p>
						)
			}
	
	</section>

)
export default Instructions