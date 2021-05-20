import {GraphQLServer} from 'graphql-yoga'
import db from './db'



const resolvers = {
    Mutation:{
        createUser(parent, args, {db}, info){
            const user = {
                name: args.data.name,
                email: args.email,
                age: args.age
            }
            ;
            return db.user
        }
    },
    Query:{
        users(parent, args, {db}, info) {
            return db.users
        },
        me() {
            return {
                id: 12356,
                name: 'tom',
                occupation: 'builder'
            }
        },
        post(parent, args, {db}, info) {
            return db.post
        },
        posts(parent, args, {db}, info) {
            // if(!args) {
            //     return posts
            // }
            // return posts.filter((post) => {
            //     return post.title.toLowerCase().includes(args.query)
            // });
            return db.posts
        },
        comments(parent, args, {db}, info) {
            return db.comments
        }
    },  
    Post: {
        author(parent, args, {db}, info) {
            if(!args){
                return db.posts;
            }
            return db.users.find((user) => {
                return user.name === parent.author
            })
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter((comment) => 
                comment.post === parent.id
            )
        }
    },
    User: {
        posts(parent, args, {db}, info) {
            return db.posts.filter((post) => 
            post.author === parent.name || post.author === parent.id
            )
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter((comment) => comment.author === parent.name)
        }
        
    },
    Comment:{
        author(parent, args, {db}, info){
            return db.users.find((user) => user.id === parent.author)
        },
        post(parent, args, {db}, info){
            return db.posts.find((post) => post.id === parent.post)
        }
    }
}




const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql',
    resolvers,
    context:{
        db:db
    }
})

server.start(()=>{
    console.log("Running on Localhost: 4000")
})

