import asyncio
from database import db

async def check_problems():
    problems = await db.problems.find({}).to_list(None)
    print(f'Found {len(problems)} problems')
    for i, problem in enumerate(problems[:3]):  # Show first 3
        print(f'Problem {i+1}:')
        print(f'  Title: {problem.get("title", "N/A")}')
        print(f'  Created at: {problem.get("created_at", "MISSING")}')
        print(f'  Updated at: {problem.get("updated_at", "MISSING")}')
        print()

if __name__ == "__main__":
    asyncio.run(check_problems())