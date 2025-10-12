// utils/dateTime.ts 或组件内部
/**
 * 格式化时间戳或日期字符串，只显示本地时间
 * @param datetime 消息时间戳或日期字符串
 * @returns 格式化后的时间字符串 (如: 15:45 或 3:45 PM)
 */
export const formatMessageTime = (datetime: string | number | Date): string => {
    if (!datetime) return '';

    const date = new Date(datetime);
    
    // 使用 toLocaleTimeString，自动适应用户浏览器设置的地区和时区
    // 选项可以根据您的需求调整
    return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        // 如果您想使用24小时制，可以省略 hour12: false
        // hour12: false 
    });
};

// 如果需要显示完整的日期和时间 (例如: 2025/10/12 15:45:00)
export const formatFullDateTime = (datetime: string | number | Date): string => {
    if (!datetime) return '';

    const date = new Date(datetime);
    
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};