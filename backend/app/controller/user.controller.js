module.exports = {
    editUser
}

async function editUser(req, res){
    console.log("Dentro")
    if(!req.user) return res.status(401).send({msg:"Error not user loged"});
    const { User } = req.app.locals.db;
    const { id } = req.params;
    const { img } = req.body;
    const user = await User.findByPk(id);
    user.logo= img;
    await user.save();
    res.send(user);
}