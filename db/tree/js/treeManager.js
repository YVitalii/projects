// console.log("Script treeManager.js loaded");
// $(function () {
//   // let createFolder = function (obj)
//   // let contextmenu = ;
//   $("#tree").jstree({
//     core: {
//       check_callback: true,
//       plugins: ["contextmenu"],
//       // contextmenu: {
//       //   items: function ($node) {
//       //     var tree = $("#tree").jstree(true);
//       //     return {
//       //       create: {
//       //         separator_before: false,
//       //         separator_after: false,
//       //         label: "Створити теку",
//       //         action: function (obj) {
//       //           let trace = 1;
//       //           trace ? console.log("Create folder obj=") : null;
//       //           trace ? console.dir(obj) : null;
//       //           trace ? console.log("Create folder $node=") : null;
//       //           trace ? console.dir($node) : null;
//       //         },
//       //       },
//       //     };
//       //   },
//       // },
//       contextmenu: {
//         items: function ($node) {
//           return {
//             create: {
//               separator_before: false,
//               separator_after: false,
//               label: "Create",
//               action: function (obj) {
//                 // action code here
//               },
//             },
//           };
//         },
//       },
//       data: function (node, cb) {
//         console.log("node=");
//         console.dir(node);
//         let getData = $.ajax({
//           url: "/tree/getTree",
//           method: "GET",
//           dataType: "json",
//           data: { _id: node.id },
//         })
//           .done(function (data) {
//             let trace = 1;
//             trace ? console.log("Received data:") : null;
//             trace ? console.dir(data) : null;
//             let parseItem = $("#tree").jstree["parseItem"];
//             let parsed = [];
//             for (let i = 0; i < data.length; i++) {
//               parsed.push(parseItem(data[i]));
//             }
//             cb(parsed);
//           })
//           .fail(function (err) {
//             console.error("Error: " + err);
//           });
//       },
//     },
//   });
// });
/**
 * Функція для обробки отриманих з сервера даних
 */
$("#tree").jstree["parseItem"] = function (item) {
  let trace = 1;
  trace ? console.log("Incoming item =") : null;
  trace ? console.dir(item) : null;
  let res = {};
  res["text"] =
    (item.data.parent ? ("0" + item.data.code + ". ").slice(-4) : "") +
    item.title;
  res["id"] = item.id;
  res["children"] = item.children.length > 0 ? true : null;
  res["data"] = { code: item.code };
  return res;
};

$("#tree").jstree({
  core: {
    check_callback: true,
    data: function (node, cb) {
      console.log("node=");
      console.dir(node);
      let getData = $.ajax({
        url: "/tree/getTree",
        method: "GET",
        dataType: "json",
        data: { _id: node.id },
      })
        .done(function (data) {
          let trace = 1;
          trace ? console.log("Received data:") : null;
          trace ? console.dir(data) : null;
          // let parseItem = $("#tree").jstree["parseItem"];
          // let parsed = [];
          // for (let i = 0; i < data.length; i++) {
          //   parsed.push(parseItem(data[i]));
          // }
          cb(data);
        })
        .fail(function (err) {
          console.error("Error: " + err);
        });
    },
  }, //core

  contextmenu: {
    items: function ($node) {
      var tree = $("#tree").jstree(true);
      return {
        create: {
          separator_before: false,
          separator_after: true,
          label: "Створити теку",
          action: function (obj) {
            let trace = 1;
            trace ? console.log("Create folder obj=") : null;
            trace ? console.dir(obj) : null;
            trace ? console.log("Create folder $node=") : null;
            trace ? console.dir($node) : null;
            tree.open_node($node);
            tree.$node = tree.create_node($node, {
              text: "Нова тека",
              type: "default",
            });
            trace ? console.log("after create_node tree.$node=") : null;
            trace ? console.dir(tree.$node) : null;
            tree.deselect_all();
            tree.select_node(tree.$node);
            tree.edit(tree.$node);
          }, //action: function () {
        },
      };
    },
  },
  plugins: ["dnd", "contextmenu"],
  // },
});

//function createFolder(obj) {} //function createFolder(obj)
