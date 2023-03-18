import { addNewUser } from "../services/userServices"

export const handleAddNewUser = async (req, res) => {
    try {
        const { userAccount, password } = req.body
        await addNewUser(userAccount, password)
        return res.status(200).json({ message: "Register successfully!" })
    } catch (error) {
        return res.status(500).json(error)
    }
}
