/*
 * @Author: Maclane 1120268073@qq.com
 * @Date: 2024-03-15 21:57:45
 * @LastEditors: Maclane 1120268073@qq.com
 * @LastEditTime: 2024-03-16 10:13:51
 * @FilePath: \web-frontend\src\models\myGlobal.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCallback, useEffect, useRef, useState } from "react";
const STORAGE_KEY = "myString"
export default () => {
    const [myString, setMyString] = useState<string>();
    useEffect(() => {
        const cache = localStorage.getItem(STORAGE_KEY);
        if (cache) {
            setMyString(cache);
        } else {
            setMyString(undefined);
        }

    }, [])
    const changeString = (v: string) => {
        setMyString(v);
        localStorage.setItem(STORAGE_KEY, v)
    }
    return {
        myString,
        changeString
    }
}