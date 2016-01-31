[See necessary examples](https://drive.google.com/drive/u/0/folders/0B6Ys-9_Te2cFNktOU3VwSzA1VWs)


## Problems

1. Setting type directly on field:

```js
fields: ()=>{
  username: GraphQLString
}
```

threw this error:

```sh
Unhandled rejection Error: Query.viewer field type must be Output Type but got: undefined
```

Must pass object:

```js
fields: ()=>{
  username: {
    type: GraphQLString
  }
}
```
