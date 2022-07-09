
/**
 * Example: matrixify([1,2,3,4,5,6,7,8], 3) === [[1,2,3][4,5,6][7,8]]
 * 
 * @param arr 
 * @param dimen 
 */
 function matrixify(arr, dimen){
    let matrix = [], i, k;

    for(i=0, k=-1; i < arr.length; i++){
        if(i % dimen === 0){
            k++;
            matrix[k] = [];
        }
        matrix[k].push(arr[i]);
    }

    return matrix;
}

function randomizeArray(arr) {
    let array = [...arr]
    
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    return array
}

/**
* Example: 91 145 98 09 === +998911459809
* Example: 91 145 98 9 === false
* Example: +998 91145 98 09 === +998911459809
* Example: a91 145 98 09 === false
* 
* @param @nullable phoneNumber (String)
*/
function phoneNumberDetector(phoneNumber){
    let phone = phoneNumber.replace(/[\+ \-]/g, '')
    phone = phone.match(/^[0-9+]*$/gm)
    
    if(!phone){
        return false
    }

    phone = phone[0]

    if(phone.length == 12){
        if(phone.substr(0, 3) === '998'){
            phone = '+' + phone
            return phone
        }
    }
    
    if(phone.length == 9){
        phone = '+998' + phone
        return phone
    }

    return false
}

function getInnerProp(obj, strPropsArr){
    const curProp = strPropsArr[0]
    if(curProp){
         strPropsArr.shift()
         return getInnerProp(obj[curProp], strPropsArr)
    } else {
         return obj
    }
}

function getText(lang, callback){
    return getInnerProp(Locales[lang].scenes, callback.split('.'))
}

function updateProps(obj, props){
    let newObj = obj
    
    for(let i=0; i < Object.keys(props).length; i++){
      const key = Object.keys(props)[i]
      const value = props[key]
      newObj[key] = value
    }

    return newObj
}

async function sendSceneMessageSafely(ctx, caption, keyboard){
    if(ctx.session.currentSceneMsg){
         try{
              ctx.editMessageText(caption, {
                   parse_mode: 'HTML',
                   ...keyboard
              })
              .then( msg => ctx.session.currentSceneMsg = msg)
              .catch( err => {
                   ctx.replyWithHTML(caption, keyboard)
                   .then( msg => ctx.session.currentSceneMsg = msg)
              })
         } catch(err){
              ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
              .then( () => {
                   ctx.replyWithHTML(caption, keyboard)
                   .then( msg => ctx.session.currentSceneMsg = msg)
              })
              .catch( err => {
                   ctx.replyWithHTML(caption, keyboard)
                   .then( msg => ctx.session.currentSceneMsg = msg)
              })

         }
    } else {
         ctx.replyWithHTML(caption, keyboard)
         .then( msg => ctx.session.currentSceneMsg = msg)
    }
}

async function sendSceneMessageWithAdSafely(ctx, caption, keyboard){
    if(ctx.session.currentSceneMsg){
         try{
              ctx.editMessageText(caption, {
                   parse_mode: 'HTML',
                   ...keyboard
              })
              .then( msg => ctx.session.currentSceneMsg = msg)
              .catch( err => {
                   ctx.replyWithHTML(caption, keyboard)
                   .then( msg => ctx.session.currentSceneMsg = msg)
              })
         } catch(err){
              ctx.deleteMessage(ctx.session.currentSceneMsg.message_id)
              .then( () => {
                   ctx.replyWithHTML(caption, keyboard)
                   .then( msg => ctx.session.currentSceneMsg = msg)
              })
              .catch( err => {
                   ctx.replyWithHTML(caption, keyboard)
                   .then( msg => ctx.session.currentSceneMsg = msg)
              })

         }
    } else {
         ctx.replyWithHTML(caption, keyboard)
         .then( msg => ctx.session.currentSceneMsg = msg)
    }
}

function uploadToRemoteStorage(imagePath){
    const image = fs.readFileSync(imagePath);

    const form = new FormData();
    form.append('file', image, imagePath);

    return axios.post(`https://mahercoder.fun/uploadByFile`, form, {
         headers: {
              ...form.getHeaders(),
              Authentication: 'Bearer ...',
         },
    })
}

module.exports = {
    matrixify,
    randomizeArray,
    phoneNumberDetector,
    getText,
    updateProps,
    sendSceneMessageSafely,
    uploadToRemoteStorage
}