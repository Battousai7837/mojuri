import { useRef, useState } from 'react';
import './rich-editor.css';

export default function RichTextEditor({name,defaultValue=''}:{name:string;defaultValue?:string}){
  const editor=useRef<HTMLDivElement>(null);const[value,setValue]=useState(defaultValue);
  function command(type:string,arg?:string){editor.current?.focus();document.execCommand(type,false,arg);setValue(editor.current?.innerHTML??'')}
  return <div className="rich-editor"><div className="rich-toolbar"><button type="button" onClick={()=>command('bold')}><b>B</b></button><button type="button" onClick={()=>command('italic')}><i>I</i></button><button type="button" onClick={()=>command('formatBlock','h2')}>H2</button><button type="button" onClick={()=>command('insertUnorderedList')}>• List</button><button type="button" onClick={()=>{const url=prompt('Link URL');if(url)command('createLink',url)}}>Link</button><button type="button" onClick={()=>command('removeFormat')}>Clear</button></div><div ref={editor} className="rich-content" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{__html:defaultValue}} onInput={event=>setValue(event.currentTarget.innerHTML)}/><input type="hidden" name={name} value={value}/></div>
}
