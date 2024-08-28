import bcrypt from 'bcrypt';
export const hashpassword= async (password)=>{
const saltRounds=10;
const salt =await bcrypt.genSalt(saltRounds);
return await bcrypt.hash(password,salt)
}

export const comparePassword=async (password,hash)=>{
    return await bcrypt.compare(password,hash)
};