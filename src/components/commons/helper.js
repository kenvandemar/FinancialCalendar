export default class globalper {
    static dateMasks = {
        default: "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    static arabicDigits = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
    static ISOFormatDate = "yyyy-mm-dd";
    static paramDateFormat = "yyyymmdd";

    //Format number
    static formatNumber(number, decimalPlaces = 2) {
        var c = decimalPlaces;
        // var d = this.globalVars.generalSettings.separator.decimal;
        // var t = this.globalVars.generalSettings.separator.thousand;
        
        var d = ".";
        var t = ",";

        c = isNaN(c = Math.abs(c)) ? 2 : c;
        d = d == undefined ? "," : d;
        t = t == undefined ? "." : t;
        var n = number, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        var num = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - parseInt(i)).toFixed(c).slice(2) : "");
        return num;
    }

    //Get Phrase By Language
    static getPhrase(phraseId, module = "Common") {
        try {
            let defaultCustomPhraseValue = "";
            if (global.companyData.translations && global.companyData.translations != null) {
                let _module = module.toLowerCase();
                let _phraseId = phraseId.toLowerCase();
                if (global.companyData.translations["en-gb"]) {
                    let customPhrase = global.companyData.translations["en-gb"];
                    if (customPhrase[_module] && customPhrase[_module][_phraseId]) {
                        return customPhrase[_module][_phraseId];
                    }
                    else if (customPhrase.common && customPhrase.common[_phraseId]) {                        
                        return customPhrase.common[_phraseId];
                    }
                    else {
                        defaultCustomPhraseValue = this.getDefaultTranslation(_module, _phraseId);
                    }
                }
                else {
                    defaultCustomPhraseValue = this.getDefaultTranslation(_module, _phraseId);
                }
            }
            if (global.langData[module] != undefined && global.langData[module][phraseId] != undefined){
                return global.langData[module][phraseId];
            }
            else {
                if (global.langData.Common[phraseId] != undefined)
                    return global.langData.Common[phraseId];
                else {
                    for (let key in global.langData.Common) {
                        if (key.toLowerCase() == phraseId) {
                            return global.langData.Common[key];
                        }
                    }
                }
            }
            return defaultCustomPhraseValue;
        }
        catch (ex) {
            return "";
        }
    }

    static getDefaultTranslation(_module, _phraseId){
        if (global.companyData.translations["en-gb"]) {
            let defaultTranslationsByLang = global.companyData.translations["en-gb"];
            if (defaultTranslationsByLang[_module] && defaultTranslationsByLang[_module][_phraseId]) {
                return defaultTranslationsByLang[_module][_phraseId];
            }
            else if (defaultTranslationsByLang.common && defaultTranslationsByLang.common[_phraseId]) {
                return defaultTranslationsByLang.common[_phraseId];
            }
        }
        return "";
    }

    //Format date
    static formatDate(date, mask, arabicConvert = false) {
        var pad = function (val, len = 2) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

        let utc = false;
        var token = /d{1,4}|m{1,4}|y{1,4}|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g;
        // Regexes and supporting functions are cached through closure
        //return function (date, mask, utc) {
        //var dF = dateFormat;
        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }
        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");
        //mask = String(this.dateMasks[mask] || mask || this.dateMasks["default"]);
        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }
        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
            d: d,
            dd: pad(d),
            //ddd:  dF.i18n.dayNames[D],
            //dddd: dF.i18n.dayNames[D + 7],
            ddd: global.langData.Common.DOWNames[D].slice(3),
            dddd: global.langData.Common.DOWNames[D],
            m: m + 1,
            mm: pad(m + 1),
            //mmm:  dF.i18n.monthNames[m],
            //mmmm: dF.i18n.monthNames[m + 12],
            mmm: global.langData.Common.MonthNamesShort[m],
            mmmm: global.langData.Common.MonthNames[m],
            y: y,
            yy: String(y).slice(2),
            yyy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? "a" : "p",
            tt: H < 12 ? (global.isArabic ? "ص" : "am") : (global.isArabic ? "م" : "pm"),
            T: H < 12 ? "A" : "P",
            TT: H < 12 ? (global.isArabic ? "ص" : "AM") : (global.isArabic ? "م" : "PM"),
            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
            //S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };
        var rDate = mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
        //if (arabicConvert && this.globalVars.isArabic && this.globalVars.useEasternArabicNumbers)
        if (arabicConvert)
            rDate = this.convertToArabic(rDate);
        return rDate;
    }

    static pad(val, len = 2) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    }

        //Get market status
    //return true | false (open|close)
    static getMarketStatus(marketId, markets) {
        let date = new Date();
        let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        let marketInfo = markets.filter(market => market.id == marketId);
        if (marketInfo.length > 0) {
            let UtcOffSet = marketInfo[0].baseutcoffset;
            // using supplied offset
            let tzOffSet = null;
            if (UtcOffSet != null && UtcOffSet != undefined) {
                tzOffSet = UtcOffSet.replace(":", ".").replace("GMT", "");
            }
            let newDate = new Date(utc + (3600000 * (tzOffSet)));
            let dayOff = null;
            if (marketInfo[0].businessdaysstot != undefined && marketInfo[0].businessdaysstot != null) {
                if (marketInfo[0].businessdaysstot)
                    dayOff = [5, 6];
                else
                    dayOff = [6, 0];
            }
            let currentDay = newDate.getDay();
            if (dayOff != null && dayOff.indexOf(currentDay) >= 0) {
                return false;
            }
            let timeByTZ = (newDate.getHours() * 60) + newDate.getMinutes();
            let marketOT = marketInfo[0].opentimelocal;
            let marketCT = marketInfo[0].closetimelocal;
            if (marketOT != undefined && marketOT != null && marketCT != undefined && marketCT != null) {
                marketOT = marketOT.split(":");
                marketOT = (parseFloat(marketOT[0]) * 60) + parseFloat(marketOT[1]);
                marketCT = marketCT.split(":");
                marketCT = (parseFloat(marketCT[0]) * 60) + parseFloat(marketCT[1]);
                if (marketOT <= timeByTZ && marketCT >= timeByTZ) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    //Convert number to Arabic digits
    static convertToArabic(number) {
        var arabic = { "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤", "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩" };
        var chars = number.toString().split("");
        var newNum = new Array();
        for (var i = 0; i < chars.length; i++) {
            if (arabic[chars[i]] == undefined || arabic[chars[i]] == null)
                newNum[i] = chars[i];
            else
                newNum[i] = arabic[chars[i]];
        }
        return newNum.join("");
    }

    //Get config value by language
    static getConfigValueByLang(objSetting) {
        let currentLanguage = "en-gb"; //this.globalVars.generalSettings.language.value.toLowerCase()
        if (objSetting[currentLanguage] != undefined)
            return objSetting[currentLanguage];
        else if (objSetting["en-gb"] != undefined)
            return objSetting["en-gb"];
        else return "";
    }

    // Get decimal digits by currency code
    static getDecimalDigits(currency) {
        if (global.companyData.common.currencies != undefined) {
            let objCurrency = global.companyData.common.currencies.filter(currencyConfig => currencyConfig.code == currency);
            if (objCurrency.length > 0)
                return objCurrency[0].decimaldigits;
        }
        return 2;
    }

    //Get currency name by currency code
    static getCurrencyName(code) {
        let currencyName = this.getPhrase(code, "CurrencyCode");
        if (currencyName != "" && currencyName.length > 0)
            return currencyName;
        else
            return code;
    }

    // Get Language Name By LangCode
    static getLanguageName() {
        let twoLetterLangName = global.language.value.toLowerCase().split('-')[0];
        switch (twoLetterLangName) {
            case "en":
                return "english";
            case "de":
                return "german";
            case "es":
                return "spanish";
            case "fr":
                return "french";
            case "it":
                return "italian";
            case "nl":
                return "dutch";
            case "fi":
                return "finnish";
            case "sv":
                return "swedish";
            case "ru":
                return "russian";
            case "pl":
                return "polish";
            case "zh":
            case "cn":
            case "chs":
            case "tw":
            case "cht":
                return "chinese";
            case "ja":
                return "japanese";
            case "ko":
                return "korean";
            case "is":
                return "icelandic";
            case "da":
                return "danish";
            case "no":
            case "nb":
            case "nn":
                return "norwegian";
            case "ar":
                return "arabic";
            case "vi":
                return "vietnamese";
            default:
                return "english";
        }
    }

    //Convert date time from server format to client format
    static convertJSDatePattern(pattern, isDate) {
        if (isDate) {
            if (pattern.indexOf("M") >= 0)
                pattern = pattern.replace(/M/g, 'm');
        }
        else {
            if (pattern.indexOf("m") >= 0)
                pattern = pattern.replace(/m/g, 'M');
            if (pattern.indexOf("a") >= 0)
                pattern = pattern.replace(/a/g, 'TT');
        }
        return pattern;
    }

    // Get config value from company data (settings.json)
    static getConfigData(module, key, isGetByLang = false) {
        try {
            let currentLang = "en-gb"; //this.globalVars.generalSettings.language.value.toLowerCase()
            if (global.companyData[module] != undefined && global.companyData[module][key] != undefined) {
                if (!isGetByLang)
                    return global.companyData[module][key];
                else if (global.companyData[module][key][currentLang] != undefined) {
                    return global.companyData[module][key][currentLang];
                }
                else if (global.companyData[module][key]["en-gb"] != undefined) {
                    return global.companyData[module][key]["en-gb"];
                }
            }
            return "";
        }
        catch (ex) {
            return "";
        }
    }

    //Convert number from Arabic to Eng digits
    static convertToEng(number) {
        var arabic = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
        var chars = number.toString().split("");
        var newNum = new Array();
        for (var i = 0; i < chars.length; i++) {
            if (arabic[chars[i]] == undefined || arabic[chars[i]] == null)
                newNum[i] = chars[i];
            else
                newNum[i] = arabic[chars[i]];
        }
        return newNum.join("");
    }

}