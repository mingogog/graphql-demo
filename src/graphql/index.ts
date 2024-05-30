import  User from '../models/User';

const sharedUserFields = `
    username: String,
    email: String,
    password: String,
`
export const typeDefs = `#graphql
    type User {
        id: ID!
        friends: [User]
        ${sharedUserFields}
    }
    
    input UserInput {
        ${sharedUserFields}
    }
        
    input AddFriendInput {
        userId: ID!
        friendId: ID!
    }

    type Query {
        getUserById(id: ID!): User
        getAllUser: [User]
    }
    
    type Mutation {
        createUserFromInput(input: UserInput!): User
        createUser(username: String, email: String, password: String): User
        updateUser(id: ID, username: String, email: String, password: String): User
        deleteUser(id: ID): User

        addFriend(input: AddFriendInput!): User
    }
`;


export const resolvers = {
    Query: {
        getUserById: async(_: any, {id}: any) => {
            const user = await User.findById(id).populate('friends');
            return user;
        },
        getAllUser: async() => {
            let users = await User.find({}).populate('friends');
            return users;
        }
    },
    Mutation: {
        createUserFromInput: async (_: any, { input }: any) => {
            const newUser = new User(input);
            await newUser.save();
            return newUser;
        },
        createUser: async (_: any, { username, email, password }: any) => {
            const newUser = new User({ username, email, password });
            return await newUser.save();
        },
        updateUser: async (_: any, { id, username, email, password }: any) => {
            const updatedUser = await User.findByIdAndUpdate(id, { username, email, password }, { new: true });
            return updatedUser
        },
        deleteUser: async (_: any, { id }: any) => {
            const deletedUser = await User.findByIdAndDelete(id);
            return deletedUser;
        },
        addFriend: async (_: any, { input }: any) => {
            const { userId, friendId } = input;
            const user = await User.findById(userId);
            const friend = await User.findById(friendId);
            if (user && friend) {
                user.friends.push(friend);
                await user.save();
                return user.populate('friends');
            } else {
                throw new Error('User or Friend not found');
            }
        },
    },
    User: {
        friends: async (parent: any) => {
            return await User.find({ _id: { $in: parent.friends } });
        }
    }
};