const transactionTypeDef = `#graphql
type Transaction {
    _id: ID!
    userId: String!
    description: String!
    paymentType: String!
    catagory: String!
    amount: String!
    location: String
    date: String!
}

type Query {
    transaction: [Transaction!]
    transaction(transactioId:ID!): Transaction
}

type Mutation {
    createTransaction(inpput: createTransactionInput!): Transaction!
    updateTransaction(inpput: updateTransactionInput!): Transaction!
    deleteTransaction(transactionId: ID!): Transaction!
}

type createTransactionInput {
    description: String!
    paymentType: String!
    catagory: String!
    amount: String!
    location: String
    date: String!
}
type updateTransactionInput {
    transactioId: ID!
    description: String
    paymentType: String
    catagory: String
    amount: String
    location: String
    date: String
}
`;

export default transactionTypeDef;
