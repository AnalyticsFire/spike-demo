var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    countries: {
      type: new GraphQLList(Country.graphql),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInteger)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, args) => {
        Country.sql.find(args)
      }
    },
    data: {
      type: new GraphQLList(Datum.graphql),
      args: {
        years: {
          type: new GraphQLList(GraphQLInteger)
        },
        country_id: {
          type: new GraphQLList(GraphQLInteger)
        }
      },
      resolve: (root, args)=>{
        Datum.findAll({where: args})
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: queryType
});
