(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{87:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return l})),t.d(n,"metadata",(function(){return u})),t.d(n,"toc",(function(){return d})),t.d(n,"default",(function(){return h}));var s=t(3),o=t(8),r=(t(0),t(96)),i=t(101),a=t(100),l={title:"Checking For Fields To Do Conditional JOINs"},u={unversionedId:"recipes/checking-for-fields",id:"recipes/checking-for-fields",isDocsHomePage:!1,title:"Checking For Fields To Do Conditional JOINs",description:"As we showed in the getting started section of this documentation, the hasFields() utility allows us to check if fields under a given path were requested in the query.",source:"@site/docs/recipes/checking-for-fields.mdx",slug:"/recipes/checking-for-fields",permalink:"/graphql-utils/docs/recipes/checking-for-fields",editUrl:"https://github.com/jenyus-org/graphql-utils/edit/master/docs/docs/recipes/checking-for-fields.mdx",version:"current",sidebar:"docsSidebar",previous:{title:"Working With Field Maps",permalink:"/graphql-utils/docs/recipes/field-maps"},next:{title:"Resolving Selections For Use With ORMs",permalink:"/graphql-utils/docs/recipes/resolving-selections"}},d=[{value:"Array Notation",id:"array-notation",children:[]},{value:"Greedy",id:"greedy",children:[]},{value:"Usage with KnexJS",id:"usage-with-knexjs",children:[]},{value:"Playground",id:"playground",children:[]}],c={toc:d};function h(e){var n=e.components,t=Object(o.a)(e,["components"]);return Object(r.b)("wrapper",Object(s.a)({},c,t,{components:n,mdxType:"MDXLayout"}),Object(r.b)("p",null,"As we showed in the getting started section of this documentation, the ",Object(r.b)("inlineCode",{parentName:"p"},"hasFields()")," utility allows us to check if fields under a given path were requested in the query."),Object(r.b)("p",null,"The path we specify may be in dot notation or as an array of fields, and we can specify if the field should be at the root level or we want to search at any depth, which will have it do a greedy search for the fields."),Object(r.b)("p",null,"Here, using dot notation:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    posts(_, __, ___, info) {\n      const requestedAuthor = hasFields(info, "posts.author");\n      console.log(requestedAuthor);\n    },\n  },\n};\n')),Object(r.b)("p",null,"Given the following query, this will output ",Object(r.b)("inlineCode",{parentName:"p"},"true")," to the console:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-graphql"},"{\n  posts {\n    id\n    title\n    body\n    author {\n      id\n      username\n      firstName\n      lastName\n    }\n  }\n}\n")),Object(r.b)("h2",{id:"array-notation"},"Array Notation"),Object(r.b)("p",null,"As mentioned above, we may also use arrays to specify the fields we're looking for:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    posts(_, __, ___, info) {\n      const requestedAuthor = hasFields(info, ["posts", "author"]);\n      console.log(requestedAuthor);\n    },\n  },\n};\n')),Object(r.b)("h2",{id:"greedy"},"Greedy"),Object(r.b)("p",null,"If we simply want to check, whether ",Object(r.b)("inlineCode",{parentName:"p"},"author")," was requested at all, we can also use the greedy search by setting the last argument to ",Object(r.b)("inlineCode",{parentName:"p"},"false"),":"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    posts(_, __, ___, info) {\n      const requestedAuthor = hasFields(info, "author", false);\n      console.log(requestedAuthor);\n    },\n  },\n};\n')),Object(r.b)("h2",{id:"usage-with-knexjs"},"Usage with KnexJS"),Object(r.b)("p",null,"By checking if the ",Object(r.b)("inlineCode",{parentName:"p"},"author")," is being queried in advance, we can do conditional ",Object(r.b)("inlineCode",{parentName:"p"},"JOIN"),"s using KnexJS and avoid further SQL queries:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    async posts(_, { db }, ___, info) {\n      let query = db.select("*").from("posts");\n\n      const requestedAuthor = hasFields(info, "posts.author");\n\n      if (requestedAuthor) {\n        // add an additional LEFT JOIN\n        query = query.leftJoin("users", "posts.author_id", "users.id");\n      }\n\n      let users = await query;\n      if (requestedAuthor) {\n        // remap posts with nested author\n        posts = posts.map((post) => ({\n          ...post,\n          author: {\n            username: usersUsername,\n            // ...other fields\n          },\n        }));\n      }\n      return users;\n    },\n  },\n  Post: {\n    async author(post, { db }) {\n      if (post.author) {\n        // author was already fetched in query with KnexJS\n        return post.author;\n      }\n\n      // we still need to fetch the author from the DB\n      return await db.select("*").from("users").where("id", post.author_id);\n    },\n  },\n};\n')),Object(r.b)("h2",{id:"playground"},"Playground"),Object(r.b)(i.a,{func:function(e){return Object(a.hasFields)(e,"posts.author")},graphql:"\n  {\n    posts {\n      id\n      title\n      body\n      author {\n        id\n        username\n        firstName\n        lastName\n      }\n    }\n  }\n  ",code:'\n  import { hasFields } from "@jenyus-org/graphql-utils";\n  \n\n  const resolvers = {\n    Query: {\n      posts(_, __, ___, info) {\n        const requestedAuthor = hasFields(info, "posts.author");\n        console.log(requestedAuthor);\n      },\n    },\n  };\n',mdxType:"Sandbox"}))}h.isMDXComponent=!0}}]);