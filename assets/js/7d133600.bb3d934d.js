(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{76:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return a})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return u}));var r=n(3),o=n(7),s=(n(0),n(88)),i={title:"Checking For Fields"},a={unversionedId:"recipes/checking-for-fields",id:"recipes/checking-for-fields",isDocsHomePage:!1,title:"Checking For Fields",description:"As we showed in the getting started section of this documentation, the hasFields() utility allows us to check if fields under a given path were requested in the query.",source:"@site/docs/recipes/checking-for-fields.md",slug:"/recipes/checking-for-fields",permalink:"/graphql-utils/docs/recipes/checking-for-fields",editUrl:"https://github.com/jenyus-org/graphql-utils/edit/master/docs/docs/recipes/checking-for-fields.md",version:"current",sidebar:"docsSidebar",previous:{title:"Retrieving A Field Map Of The Query",permalink:"/graphql-utils/docs/recipes/retrieve-field-map"},next:{title:"Resolving Selections",permalink:"/graphql-utils/docs/recipes/resolving-selections"}},l=[{value:"Array Notation",id:"array-notation",children:[]},{value:"Greedy",id:"greedy",children:[]},{value:"Usage with KnexJS",id:"usage-with-knexjs",children:[]},{value:"Usage with MikroORM",id:"usage-with-mikroorm",children:[]}],c={toc:l};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(s.b)("wrapper",Object(r.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",null,"As we showed in the getting started section of this documentation, the ",Object(s.b)("inlineCode",{parentName:"p"},"hasFields()")," utility allows us to check if fields under a given path were requested in the query."),Object(s.b)("p",null,"The path we specify may be in dot notation or as an array of fields, and we can specify if the field should be at the root level or we want to search at any depth, which will have it do a greedy search for the fields."),Object(s.b)("p",null,"Here, using dot notation:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    posts(_, __, ___, info) {\n      const requestedAuthor = hasFields(info, "posts.author");\n      console.log(requestedAuthor);\n    },\n  },\n};\n')),Object(s.b)("p",null,"Given the following query, this will output ",Object(s.b)("inlineCode",{parentName:"p"},"true")," to the console:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-graphql"},"{\n  posts {\n    id\n    title\n    body\n    author {\n      id\n      username\n      firstName\n      lastName\n    }\n  }\n}\n")),Object(s.b)("h2",{id:"array-notation"},"Array Notation"),Object(s.b)("p",null,"As mentioned above, we may also use arrays to specify the fields we're looking for:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    posts(_, __, ___, info) {\n      const requestedAuthor = hasFields(info, ["posts", "author"]);\n      console.log(requestedAuthor);\n    },\n  },\n};\n')),Object(s.b)("h2",{id:"greedy"},"Greedy"),Object(s.b)("p",null,"If we simply want to check, whether ",Object(s.b)("inlineCode",{parentName:"p"},"author")," was requested at all, we can also use the greedy search by setting the last argument to ",Object(s.b)("inlineCode",{parentName:"p"},"false"),":"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    posts(_, __, ___, info) {\n      const requestedAuthor = hasFields(info, "author", false);\n      console.log(requestedAuthor);\n    },\n  },\n};\n')),Object(s.b)("h2",{id:"usage-with-knexjs"},"Usage with KnexJS"),Object(s.b)("p",null,"By checking if the ",Object(s.b)("inlineCode",{parentName:"p"},"author")," is being queried in advance, we can do conditional ",Object(s.b)("inlineCode",{parentName:"p"},"JOIN"),"s using KnexJS and avoid further SQL queries:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-ts"},'import { hasFields } from "@jenyus-org/graphql-utils";\n\nconst resolvers = {\n  Query: {\n    async posts(_, { db }, ___, info) {\n      let query = db.select("*").from("posts");\n\n      const requestedAuthor = hasFields(info, "posts.author");\n\n      if (requestedAuthor) {\n        // add an additional LEFT JOIN\n        query = query.leftJoin("users", "posts.author_id", "users.id");\n      }\n\n      let users = await query;\n      if (requestedAuthor) {\n        // remap posts with nested author\n        posts = posts.map((post) => ({\n          ...post,\n          author: {\n            username: usersUsername,\n            // ...other fields\n          },\n        }));\n      }\n      return users;\n    },\n  },\n  Post: {\n    async author(post, { db }) {\n      if (post.author) {\n        // author was already fetched in query with KnexJS\n        return post.author;\n      }\n\n      // we still need to fetch the author from the DB\n      return await db.select("*").from("users").where("id", post.author_id);\n    },\n  },\n};\n')),Object(s.b)("h2",{id:"usage-with-mikroorm"},"Usage with MikroORM"),Object(s.b)("p",null,"\ud83d\udea7 Work in Progress!"))}u.isMDXComponent=!0},88:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return f}));var r=n(0),o=n.n(r);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=o.a.createContext({}),u=function(e){var t=o.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},d=function(e){var t=u(e.components);return o.a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},h=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),h=r,f=d["".concat(i,".").concat(h)]||d[h]||p[h]||s;return n?o.a.createElement(f,a(a({ref:t},c),{},{components:n})):o.a.createElement(f,a({ref:t},c))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,i=new Array(s);i[0]=h;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:r,i[1]=a;for(var c=2;c<s;c++)i[c]=n[c];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}h.displayName="MDXCreateElement"}}]);