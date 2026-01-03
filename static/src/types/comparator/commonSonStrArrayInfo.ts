/**
 * 用于存储两个字符串的公共子串信息的类
 */
export class CommonSonStrArrayInfo {
    /**
     * 公共子串在原始（被对比）字符串中的起始下标
     */
    public originStartIndex: number = 0;
    /**
     * 公共子串在原始（被对比）字符串中的结束下标
     */
    public originEndIndex: number = 0;
    /**
     * 公共子串在新的字符串中的起始下标
     */
    public newStartIndex: number = 0;
    /**
     * 公共子串在新的字符串中的结束下标
     */
    public newEndIndex: number = 0;

    constructor(
        originStartIndex: number = 0,
        originEndIndex: number = 0,
        newStartIndex: number = 0,
        newEndIndex: number = 0
    ) {
        this.originStartIndex = originStartIndex;
        this.originEndIndex = originEndIndex;
        this.newStartIndex = newStartIndex;
        this.newEndIndex = newEndIndex;
    }
}