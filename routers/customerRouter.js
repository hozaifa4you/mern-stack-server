const router = require("express").Router();

const Customer = require("../models/Customer");

router.post("/", async (req, res) => {
	try {
		const { name } = req.body;
		const newCustomer = new Customer({ name });
		const savedCustomer = newCustomer.save();
		res.status(200).json(savedCustomer);
	} catch (err) {
		console.log(err.message);
		res.status(500).send();
	}
});

module.exports = router;
