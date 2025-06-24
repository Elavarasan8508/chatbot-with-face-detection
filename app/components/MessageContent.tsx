import ReactMarkdown from 'react-markdown';

export const MessageContent = ({ message }) => {
    if (message.isMarkdown) {
      return (
        <div className="markdown-content">
          <ReactMarkdown 
            components={{
              p: ({ node, ...props }) => <p className="mb-2" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              code: ({ node, inline, ...props }) => 
                inline ? (
                  <code className="bg-gray-100 px-1 rounded" {...props} />
                ) : (
                  <code className="block bg-gray-100 p-2 rounded mb-2 whitespace-pre-wrap" {...props} />
                ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2" {...props} />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      );
    }
    return <div>{message.text}</div>;
  };