import json
import os

transcript_path = r'C:\Users\shash.DESKTOP-7JGCNTQ\.gemini\antigravity-ide\brain\b350d5aa-4d72-4559-abdf-118ec350626f\.system_generated\logs\transcript.jsonl'
output_dir = 'true_earliest_files'

os.makedirs(output_dir, exist_ok=True)
files_seen = set()

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
        
        if 'tool_calls' in data:
            for tc in data['tool_calls']:
                if tc.get('name') in ['write_to_file', 'default_api:write_to_file', 'replace_file_content', 'default_api:replace_file_content', 'multi_replace_file_content', 'default_api:multi_replace_file_content']:
                    args = tc.get('arguments', tc.get('args', {}))
                    target = args.get('TargetFile', '')
                    if isinstance(target, str):
                        target = target.strip('"\'')
                        
                    if not target:
                        continue
                    
                    filename = os.path.basename(target)
                    if filename not in files_seen:
                        files_seen.add(filename)
                        
                        content = args.get('CodeContent', args.get('ReplacementContent', ''))
                        if isinstance(content, str):
                            try:
                                content = json.loads(content)
                            except:
                                pass
                                
                        out_path = os.path.join(output_dir, filename)
                        with open(out_path, 'w', encoding='utf-8') as out:
                            out.write(content)
                        print(f'Dumped earliest write of {filename}')
                        
        if data.get('type') == 'TOOL_RESPONSE' and 'tool_outputs' in data:
            for out_data in data['tool_outputs']:
                text = out_data.get('output', '')
                if 'File Path: `file:///' in text and 'Showing lines' in text:
                    start = text.find('file:///') + 8
                    end = text.find('`', start)
                    if end > start:
                        path = text[start:end]
                        filename = os.path.basename(path)
                        
                        if filename not in files_seen:
                            files_seen.add(filename)
                            out_path = os.path.join(output_dir, filename + '_view.txt')
                            with open(out_path, 'w', encoding='utf-8') as out:
                                out.write(text)
                            print(f'Dumped earliest view of {filename}')
