module.exports = {
    editUser
}

async function editUser(req, res){
    const { User } = req.app.locals.db;
    const { id } = req.params;
    const { oldUser } = req.body;
    const newUser = await User.findByPk(id);
    newUser.name = oldUser.name;
    newUser.last_name = oldUser.last_name;
    newUser.password  = oldUser.password;
    newUser.logo  = oldUser.logo;
    newUser.ispremiun  = oldUser.ispremiun;
    await newUser.save();
    res.send(newUser);
}