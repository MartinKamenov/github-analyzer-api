# github-analyzer-api
Github crawer (NodeJs backend) for GitAnalyzator

## 1. Models
### User 
- username (name of github user),
- data (contributions users): {
- pictureUrl (Url leading to profile image),
- totalContributionsCount (Number of contributions for year or for last year),
- daysWithoutContributions(Number of days without contributions for year or for last year),
- conclussiveContributions(Number of conclusive days with contributions for year or for last year),
- maxContributionsForDay (Number of maximal contributions in a day in a year or for last year),
- dateContributionsNumbers":(Array with contribution numbers for each day in a year)

## 2. Routes
### Github [/github]
#### Get contributions for profile [/contributions/:username]
1. [GET] request type

2. Description: Getting contribution details for particular profile

3. Return type: Object

4. Param object:
- username(string: github username)

5. Query object(Not obligatory)
- year(number)

6. Example
- Request: (GET)[URL][/github/gaearon?year=2018]
- Responce: 
{
 "username":"gaearon",
 "data":{
     "pictureUrl":"https://avatars1.githubusercontent.com/u/810438?s=460&v=4",
     "totalContributionsCount":2111,
     "daysWithoutContributions":80,
     "conclussiveContributions":28,
     "maxContributionsForDay":91,
     "dateContributionsNumbers":[4,91 ...]
 }
}

#### Get contributions for two profiles(For comparison) [/contributions/:firstUsername/:secondUsername]
1. [GET] request type

2. Description: Getting contribution details for particular profile

3. Return type: Array of user objects

4. Param object:
- firstUsername(string: github first username)
- secondUsername(string: github first username)

5. Query object(Not obligatory)
- year(number)

6. Example
- Request: (GET)[URL][/github/gaearon/acdlite]
- Responce:
[
  {
   "username":"gaearon",
   "data":{
     "pictureUrl":"https://avatars1.githubusercontent.com/u/810438?s=460&v=4",
     "totalContributionsCount":2111,
     "daysWithoutContributions":80,
     "conclussiveContributions":28,
     "maxContributionsForDay":91,
     "dateContributionsNumbers":[4,91 ...]
   }
  },
  {
    "username":"acdlite",
    "data":{
      "pictureUrl":"https://avatars2.githubusercontent.com/u/3624098?s=460&v=4",
      "totalContributionsCount":591,
      "daysWithoutContributions":191,
      "conclussiveContributions":7,
      "maxContributionsForDay":28,
      "dateContributionsNumbers":[0,2 ...]
     }
   }
]

#### Get all searched users [/users]
1. [GET] request type

2. Description: Getting users that have been searched sorting them descending by total contribution.
* Route supports paging.
* Route supports filtering.
* Route supports sorting(using sortBy in query params)

3. Return type: Object that has paging information and users can be found in users field

4. Query object:
- page(number of the page)
- pagesize(number representing records on page)
- sortBy(what criteria to use for sorting)
- username(searches only usernames that include this field's value)
- language(programming languages that are main for user. To find by multiple languages use '|' symbol as separator. Multile language functionality works as 'or'(not 'and'))
- Filtering params that are part from user model fields

5. Examle
- Request: (GET)[URL][/github/users?page=1&pageSize=6&sortBy=totalContributionsCount&username=ma&languages=Java|JavaScript]
- Responce: {"users":[{user model}, ...], "page":1,"pageSize":6,"pagesCount":64,"count":379 }
