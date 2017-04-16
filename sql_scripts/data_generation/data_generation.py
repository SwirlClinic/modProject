import pandas as pd
import random
import hashlib

def secondDateLater(first,second):
    if(second[0] - first[0] > 0):
        return True
    elif(second[0] - first[0] < 0):
        return False
    elif(second[1] - first[1] > 0):
        return True
    elif(second[1] - first[1] < 0):
        return False
    elif(second[2] - first[2] > 0):
        return True
    else:
        return False

def createDateAfter(postDate):
    year = random.randint(postDate[0],2016)
    month = random.randint(1,12)
    day = random.randint(1,28)
    while(secondDateLater([year,month,day],postDate)):
        year = random.randint(postDate[0],2016)
        month = random.randint(1,12)
        day = random.randint(1,28)
    return str(year) + "-" + str(month).zfill(2) + "-" + str(day).zfill(2)

def createRandomString(n,letterChoices):
    randomString = ""
    for i in range(0,n):
        randomString += random.choice(letterChoices)
    return randomString

def createUserTable():
    table = []
    emailEndings = [".com",".org",".edu",".co"]
    lettersAndNums = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    for i in range(0,2000):
        #Username Generation
        username = "Username"+str(i)
        #Email Generation
        email = ""
        startEmailNum = random.randint(3,15)
        email += createRandomString(startEmailNum,lettersAndNums)
        email += "@"
        domainNum = random.randint(5,12)
        email += createRandomString(domainNum,lettersAndNums)
        email += random.choice(emailEndings)
        #Password generation
        passwordNum = random.randint(5,25)
        password = createRandomString(passwordNum,lettersAndNums)
        hash = hashlib.md5()
        hash.update(password.encode('utf-8'))
        passwordHash = hash.hexdigest()
        #Add row to table
        table.append([username,email,passwordHash])
    return pd.DataFrame(table,columns=["username","email","password"])

def createFollowsTable(usernames):
    table = []
    for i in range(0,len(usernames)):
        numOfPeopleFollowing = random.randint(0,20)
        listOfIndexes = random.sample(range(0,len(usernames)),numOfPeopleFollowing)
        while(i in listOfIndexes):
            listOfIndexes = random.sample(range(0,len(usernames)),numOfPeopleFollowing)
        for j in listOfIndexes:
            table.append([usernames[i],usernames[j]])
    return pd.DataFrame(table,columns=["follower","is_followed"])

def createGamesTable():
    table = []
    genres = ["Action","Horror","Comedy","Trivia","Platformer","Puzzle","FPS","Card","Sports"]
    lettersAndSpace = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "
    for i in range(0,2000):
        #Game Name
        name = "Game"+str(i)
        #Release Year
        releaseYear = random.randint(1970,2015)
        #description
        descriptionNum = random.randint(10,512)
        description = createRandomString(descriptionNum,lettersAndSpace)
        #genre
        genre = random.choice(genres)
        table.append([name,releaseYear,description,genre])
    return pd.DataFrame(table,columns=["name","releaseyear","description","genre"])

def createModForGamesTable(games):
    table = []
    gameMap = {}
    urlStart = ["http://","https://"]
    urlEnd = [".com",".org",".edu",".co"]
    lettersAndSpace = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "
    lettersAndNums = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    i = 1000
    for game in games:
        gameName = game[0]
        gameYear = game[1]
        gameMap[(gameName,gameYear)] = []
        for j in range(0,random.randint(1,20)):
            modId = i
            i += 1
            gameMap[(gameName,gameYear)].append(modId)
            name = createRandomString(random.randint(5,75),lettersAndSpace)
            link = random.choice(urlStart)
            link += createRandomString(random.randint(5,30),lettersAndNums)
            link += random.choice(urlEnd)
            description = createRandomString(random.randint(25,500),lettersAndSpace)
            table.append([gameName,gameYear,modId,name,link,description])
    return {"table": pd.DataFrame(table,columns=["game_name","game_release_year","modId","name","link","description"]), "map": gameMap}

def createPostTable(users,games):
    table = []
    dates = []
    lettersAndSpace = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "
    for user in users:
        for j in range(0,random.randint(0,10)):
            username = user
            gameChoice = random.choice(games)
            gameName = gameChoice[0]
            gameYear = gameChoice[1]
            title = createRandomString(random.randint(5,75),lettersAndSpace)
            year = random.randint(gameYear,2015)
            month = random.randint(1,12)
            day = random.randint(1,28)
            dates.append([year,month,day])
            date = str(year) + "-" + str(month).zfill(2) + "-" + str(day).zfill(2)
            time = str(random.randint(0,23)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2)
            body = createRandomString(random.randint(25,500),lettersAndSpace)
            table.append([username,gameName,gameYear,title,date,time,body])
    return {"table": pd.DataFrame(table,columns=["username","game_name","game_release_year","title","date","time","body"]),"dates": dates}

def createCommentsTable(postDates,posts,users):
    table = []
    lettersAndSpace = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "
    for i in range(0,len(posts)):
        postTitle = posts[i][0]
        postDateStr = posts[i][1]
        postTimeStr = posts[i][2]
        for j in range(0,random.randint(0,15)):
            commentDate = createDateAfter(postDates[i])
            commentTime = str(random.randint(0,23)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2)
            commentBody = createRandomString(random.randint(25,120),lettersAndSpace)
            username = random.choice(users)
            table.append([postTitle,postDateStr,postTimeStr,commentDate,commentTime,commentBody,username])
    return pd.DataFrame(table,columns=["post_title","post_date","post_time","comment_date","comment_time","comment_body","username"])

def createVisitsTable(postDates,posts,users):
    table = []
    for user in users:
        numVisits = random.randint(0,100)
        visitedPosts = random.sample(range(0,len(posts)),numVisits)
        for postValue in visitedPosts:
            postTitle = posts[postValue][0]
            postDateStr = posts[postValue][1]
            postTimeStr = posts[postValue][2]
            visit_date = createDateAfter(postDates[postValue])
            table.append([user,postTitle,postDateStr,postTimeStr,visit_date])
    return pd.DataFrame(table,columns=["username","title","date","time","most_recent_visit_date"])

def createPostFeaturesModTable(gameMap,postListWithGame):
    table = []
    for item in postListWithGame:
        gameName = item[0]
        gameYear = item[1]
        postTitle = item[2]
        postDate = item[3]
        postTime = item[4]
        modsForGame = gameMap[(gameName,gameYear)]
        modsLinked = random.sample(modsForGame,random.randint(1,len(modsForGame)))
        for mod in modsLinked:
            rating = random.randint(1,10)
            table.append([mod,postTitle,postDate,postTime,rating])
    return pd.DataFrame(table,columns=["modId","title","date","time","config_importance_rating"])

def createFavoritesTable(postDates,posts,users):
    table = []
    for user in users:
        numFavorites = random.randint(0,100)
        favoritePosts = random.sample(range(0,len(posts)),numFavorites)
        for postValue in favoritePosts:
            postTitle = posts[postValue][0]
            postDate = posts[postValue][1]
            postTime = posts[postValue][2]
            favorite_date = createDateAfter(postDates[postValue])
            favorite_time = str(random.randint(0,23)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2) + ":" + str(random.randint(0,59)).zfill(2)
            table.append([user,postTitle,postDate,postTime,favorite_date,favorite_time])
    return pd.DataFrame(table,columns=["username","title","date","time","favorite_date","favorite_time"])

def createIsATables(modIdList):
    addOn = []
    graphical = []
    unofficial = []
    resolutions = ["1600x900","400x300","1280x800","1440x900","1920x1200","2560x1600"]
    for modId in modIdList:
        randomNum = random.randint(1,4)
        if randomNum == 1:
            hoursAdded = random.randint(1,100)
            num_new_items = random.randint(0,500)
            addOn.append([modId,hoursAdded,num_new_items])
        elif randomNum == 2:
            resolution = random.choice(resolutions)
            fps = random.randint(30,120)
            graphical.append([modId,resolution,fps])
        elif randomNum == 3:
            version = str(random.randint(0,20)) + "." + str(random.randint(0,20)) + "." + str(random.randint(0,20))
            unofficial.append([modId,version])
    addOnTable = pd.DataFrame(addOn,columns=["modId","hours_added","num_new_items"])
    graphicalTable = pd.DataFrame(graphical,columns=["modId","resolution","fps"])
    unofficialTable = pd.DataFrame(unofficial,columns=["modId","version"])
    return {"addOn": addOnTable, "graphical": graphicalTable, "unofficial": unofficialTable}


if __name__ == "__main__":
    random.seed(2017)
    userTable = createUserTable()
    usernameList = userTable["username"].tolist()
    followsTable = createFollowsTable(usernameList)
    gameTable = createGamesTable()
    gamesList = gameTable[["name","releaseyear"]].values.tolist()
    modInfoList = createModForGamesTable(gamesList)
    modTable = modInfoList["table"]
    gameMap = modInfoList["map"]
    postInfoList = createPostTable(usernameList,gamesList)
    postTable = postInfoList["table"]
    postDates = postInfoList["dates"]
    postList = postTable[["title","date","time"]].values.tolist()
    commentsTable = createCommentsTable(postDates,postList,usernameList)
    visitsTable = createVisitsTable(postDates,postList,usernameList)
    postListWithGame = postTable[["game_name","game_release_year","title","date","time"]].values.tolist()
    postFeaturesModTable = createPostFeaturesModTable(gameMap,postListWithGame)
    favoritesTable = createFavoritesTable(postDates,postList,usernameList)
    modIdList = modTable["modId"].tolist()
    isATables = createIsATables(modIdList)
    addOnTable = isATables["addOn"]
    graphicalTable = isATables["graphical"]
    unofficialTable = isATables["unofficial"]
    #Writing to files
    userTable.to_csv("website_users.csv",encoding='utf-8',index=False,header=False)
    followsTable.to_csv("follows.csv",encoding='utf-8',index=False,header=False)
    gameTable.to_csv("game.csv",encoding='utf-8',index=False,header=False)
    modTable.to_csv("mod_for_game.csv",encoding='utf-8',index=False,header=False)
    postTable.to_csv("post.csv",encoding='utf-8',index=False,header=False)
    commentsTable.to_csv("comment_for_post.csv",encoding='utf-8',index=False,header=False)
    visitsTable.to_csv("visits.csv",encoding='utf-8',index=False,header=False)
    postFeaturesModTable.to_csv("post_features_mod.csv",encoding='utf-8',index=False,header=False)
    favoritesTable.to_csv("favorites.csv",encoding='utf-8',index=False,header=False)
    addOnTable.to_csv("add_on_mod.csv",encoding='utf-8',index=False,header=False)
    graphicalTable.to_csv("graphical_mod.csv",encoding='utf-8',index=False,header=False)
    unofficialTable.to_csv("unofficial_patch_mod.csv",encoding='utf-8',index=False,header=False)