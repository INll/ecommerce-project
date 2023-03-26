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