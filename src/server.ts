import axios from "axios";
import express from "express";
const app = express();
const { PORT = 8000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/recipes", async (req, res) => {
	const { ingredient } = req.query;
	try {
		const apiRes = await axios.get(
			"https://api.spoonacular.com/recipes/findByIngredients"
		);
	} catch (error: any) {}
	return res.status(200);
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
