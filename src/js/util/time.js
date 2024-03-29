function DateFormat (date) {
    //нет даты
    if (!date) return ''

    let nowDate = new Date()
    let nowDateJson = {
        date: nowDate.getDate(),
        month: nowDate.getMonth() +1,
        year: nowDate.getFullYear(),

        hour: nowDate.getHours(),
        minutes: nowDate.getMinutes()
    }

    let newDate = new Date(date)

    let newDateJson = {
        date: newDate.getDate(),
        month: newDate.getMonth() +1,
        year: newDate.getFullYear(),

        hour: newDate.getHours(),
        minute: newDate.getMinutes()
    }

    let monthTxt = 'Января'
    if (newDateJson.month === 2) monthTxt = 'Февраля'
    if (newDateJson.month === 3) monthTxt = 'Марта'
    if (newDateJson.month === 4) monthTxt = 'Апреля'
    if (newDateJson.month === 5) monthTxt = 'Мая'
    if (newDateJson.month === 6) monthTxt = 'Июня'
    if (newDateJson.month === 7) monthTxt = 'Июля'
    if (newDateJson.month === 8) monthTxt = 'Августа'
    if (newDateJson.month === 9) monthTxt = 'Сентября'
    if (newDateJson.month === 10) monthTxt = 'Октября'
    if (newDateJson.month === 11) monthTxt = 'Ноября'
    if (newDateJson.month === 12) monthTxt = 'Декабря'

    //редактор часа
    let hourTxt = `${newDateJson.hour}`
    if (newDateJson.hour < 10)
        hourTxt = `0${newDateJson.hour}`

    //редактор часа
    let minutesTxt = `${newDateJson.minute}`
    if (newDateJson.minute < 10)
        minutesTxt = `0${newDateJson.minute}`

    //год не совпадает
    if (nowDateJson.year !== newDateJson.year)
        return `${newDateJson.date} ${monthTxt} ${newDateJson.year}`

    if (nowDateJson.date === newDateJson.date)
        return `Сегодня в ${hourTxt}:${minutesTxt}`

    if (nowDateJson.date-1 === newDateJson.date)
        return `Вчера в ${hourTxt}:${minutesTxt}`

    return `${newDateJson.date} ${monthTxt} в ${hourTxt}:${minutesTxt}`
}

function DateFormatUser (date) {
    //нет даты
    if (!date) return ''

    let nowDate = new Date()
    let nowDateJson = {
        date: nowDate.getDate(),
        month: nowDate.getMonth() +1,
        year: nowDate.getFullYear(),

        hour: nowDate.getHours(),
        minutes: nowDate.getMinutes()
    }

    let newDate = new Date(date)

    let newDateJson = {
        date: newDate.getDate(),
        month: newDate.getMonth() +1,
        year: newDate.getFullYear(),

        hour: newDate.getHours(),
        minute: newDate.getMinutes()
    }

    let monthTxt = 'Января'
    if (newDateJson.month === 2) monthTxt = 'Февраля'
    if (newDateJson.month === 3) monthTxt = 'Марта'
    if (newDateJson.month === 4) monthTxt = 'Апреля'
    if (newDateJson.month === 5) monthTxt = 'Мая'
    if (newDateJson.month === 6) monthTxt = 'Июня'
    if (newDateJson.month === 7) monthTxt = 'Июля'
    if (newDateJson.month === 8) monthTxt = 'Августа'
    if (newDateJson.month === 9) monthTxt = 'Сентября'
    if (newDateJson.month === 10) monthTxt = 'Октября'
    if (newDateJson.month === 11) monthTxt = 'Ноября'
    if (newDateJson.month === 12) monthTxt = 'Декабря'

    //редактор часа
    let hourTxt = `${newDateJson.hour}`
    if (newDateJson.hour < 10)
        hourTxt = `0${newDateJson.hour}`

    //редактор часа
    let minutesTxt = `${newDateJson.minute}`
    if (newDateJson.minute < 10)
        minutesTxt = `0${newDateJson.minute}`

    if (nowDate - newDate < 1000*60*15)
        return `В сети`

    //год не совпадает
    if (nowDateJson.year !== newDateJson.year)
        return `${newDateJson.date} ${monthTxt} ${newDateJson.year}`

    if (nowDateJson.date === newDateJson.date)
        return `Сегодня в ${hourTxt}:${minutesTxt}`

    if (nowDateJson.date-1 === newDateJson.date)
        return `Вчера в ${hourTxt}:${minutesTxt}`

    return `${newDateJson.date} ${monthTxt} в ${hourTxt}:${minutesTxt}`
}

function UserOnline (date) {
    let style = {
        color: 'green'
    }
    let nowDate = new Date()
    let newDate = new Date(date)

    if (nowDate - newDate < 1000*60*15)
        return  <i className="fas fa-globe" style={style}></i>

    return null
}

export {
    DateFormat,
    DateFormatUser,
    UserOnline
}

/*
$('.jlen-time').each(function() {
    jDate = $(this).html().split('.')[0];
    jMonth = $(this).html().split('.')
    jTime = $(this).html().split('|')[1];
    jTimeThis = Number(sDt)-Number(1);
    jYear = $(this).html().split('.')[2].split('|')[0];
    if(jMonth[1]=='01'){jMont = 'Января';}
    if(jMonth[1]=='02'){jMont = 'Февраля';}
    if(jMonth[1]=='03'){jMont = 'Марта';}
    if(jMonth[1]=='04'){jMont = 'Апреля';}
    if(jMonth[1]=='05'){jMont = 'Мая';}
    if(jMonth[1]=='06'){jMont = 'Июня';}
    if(jMonth[1]=='07'){jMont = 'Июля';}
    if(jMonth[1]=='08'){jMont = 'Августа';}
    if(jMonth[1]=='09'){jMont = 'Сентября';}
    if(jMonth[1]=='10'){jMont = 'Октября';}
    if(jMonth[1]=='11'){jMont = 'Ноября';}
    if(jMonth[1]=='12'){jMont = 'Декабря';}

    if(jYear==sDy) {
        if(jDate==sDt) {
            $(this).html('Сегодня в '+jTime+'')
        } else
            if(jTimeThis==jDate) {
                $(this).html('Вчера в '+jTime+'');
            } else {
                $(this).html(''+jDate+' '+jMont+' в '+jTime+'');
            };
    } else {
        $(this).html(''+jDate+' '+jMont+' '+jYear+'');
    };
});*/