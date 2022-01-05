import axios from "axios";
import express from "express";
const app = express();
const { PORT = 8000 } = process.env;
import dotenv from "dotenv";
import cors from "cors";

const cache = new Map();

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

const API_KEY = process.env.SPOONACULAR_API_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
	if (!API_KEY) {
		return res.status(400).json({
			error: "Could not find API Key",
		});
	}
	next();
});

app.get("/recipes", async (req, res) => {
	const { ingredient } = req.query;
	const URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredient}`;

	if (cache.has(URL)) {
		console.log("Reading from Cache");
		return res.status(200).json(cache.get(URL));
	}

	try {
		const { data } = await axios.get(URL);
		if (!cache.has(URL)) {
			cache.set(URL, data);
		}
		return res.status(200).json(data);
	} catch (error: any) {
		return res.status(500).json({
			error: error.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
