// full list of operators, see: https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/

export const countLastMonth = [
  {
    $match: {  // filter doc based on query
      $expr: {  // enable aggregation expression
        $and: [  // true if both TRUE
          {
            $eq: [  // true if both are EQUIVALENT
              {
                $month: "$creationTime"  // get month from date: get field value
              },
              {
                $month: {
                  $dateAdd: {
                    startDate: new Date(),
                    unit: "month",
                    amount: -1
                  }
                }
              }
            ]
          },
          {//  make sure one month before is the same year as these one month before results
            $eq: [
              {
                $year: "$creationTime"  
              },
              {
                $month: {
                  $dateAdd: {
                    startDate: new Date(),
                    unit: "month",
                    amount: -1
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    $count: "result"
  }
];


export const countThisMonth = [
  {
    $match: {
      $expr: {
        $eq: [
          {
            $month: "$creationTime"
          },
          {
            $month: {
              $add: new Date()
            }
          }
        ]
      }
    }
  },
  {
    $count: "result"
  }
];


export const countLast30Days = [
  {
    $match: {
      $expr: {
        $gte: [
          {
            $add: "$creationTime"
          },
          {
            $dateAdd: {
              startDate: new Date(),
              unit: "day",
              amount: -30
            }
          }
        ]
      }
    }
  },
  {
    $count: "result"
  }
];


// DATA, paste this on mongoplayground.net

[
  {
    "_id": {
      "$oid": "63ecabb23e2de88502535a60"
    },
    "userName": "admin",
    "passWord": "adminadmin",
    "clearance": {
      "$numberInt": "2"
    },
    "orders": [],
    "creationTime": {
      "$date": {
        "$numberLong": "1676454834999"
      }
    },
    "__v": {
      "$numberInt": "0"
    },
    "lastLogin": {
      "$date": {
        "$numberLong": "1678030282829"
      }
    }
  },
  {
    "_id": {
      "$oid": "63f6e76488ad00091b7ef00f"
    },
    "userName": "asdff",
    "passWord": "$2a$10$iYdlcd7fECkCEQiqP8ozrer/rr1uAHnjNMYulk1TMvqlEaiDXo0pa",
    "clearance": {
      "$numberInt": "0"
    },
    "orders": [],
    "creationTime": {
      "$date": {
        "$numberLong": "1677125476573"
      }
    },
    "__v": {
      "$numberInt": "0"
    }
  },
  {
    "_id": {
      "$oid": "6404a361a5254342d13226a1"
    },
    "userName": "userus",
    "passWord": "$2a$10$xAzSsdGt3L.4A4cgK1FmrelgXhQBSvbeJ3MCstiYKjMKjP1tiwAS.",
    "clearance": {
      "$numberInt": "0"
    },
    "orders": [],
    "creationTime": {
      "$date": {
        "$numberLong": "1678025569500"
      }
    },
    "lastLogin": {
      "$date": {
        "$numberLong": "1678025722603"
      }
    },
    "__v": {
      "$numberInt": "0"
    }
  },
  {
    "_id": {
      "$oid": "6404b50fdfe6e2947d2ff282"
    },
    "userName": "oldUser",
    "passWord": "$2a$10$yRQnInvudoFvFHe4OAJnzuxJilIRkERbeofZTAOLC27r8.qcewkee",
    "clearance": {
      "$numberInt": "0"
    },
    "orders": [],
    "creationTime": {
      "$date": {
        "$numberLong": "1672932495661"
      }
    },
    "lastLogin": {
      "$date": {
        "$numberLong": "1678030095661"
      }
    },
    "__v": {
      "$numberInt": "0"
    }
  }
]