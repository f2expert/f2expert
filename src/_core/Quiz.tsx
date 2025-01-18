import React from 'react'

interface IQuiz {
    question: string;
    options: string[];
    answer: string;
    qtype: "radio" | "checkbox" | "text" | "code";
}

export default function Quiz({question, options, answer, qtype}: IQuiz) {
    return (
        <>
            <h2 className='pb-3'>{question}</h2>
            { options.map((option, index) => (
                <div className='pb-3' key={index}>
                    {qtype === "radio" ? <input type="radio" name="option" value={option} /> : null}
                    {qtype === "checkbox" ? <input type="checkbox" name="option" value={option} /> : null}
                    {qtype === "code" ? <textarea name="option" value={option} /> : null}
                    <span className='pl-2'>Ans: {qtype !== "code" && option}</span>
                </div>
            ))}
            <div className='pt-3'>{answer}</div>                    
        </>
    )
}
